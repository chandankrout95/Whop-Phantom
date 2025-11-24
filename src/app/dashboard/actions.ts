'use server';

import { routeOrder, RouteOrderInput, RouteOrderOutput } from '@/ai/flows/automated-order-routing';
import type { Panel, Service } from "@/lib/types";
import { z } from 'zod';

const recommendationSchema = z.object({
  serviceName: z.string(),
  quantity: z.number(),
  preference: z.enum(['price', 'deliveryTime']),
  services: z.any(),
  panels: z.any(),
});

export async function getRoutingRecommendation(input: z.infer<typeof recommendationSchema>): Promise<RouteOrderOutput> {
  // Validate input again on the server
  const validatedInput = recommendationSchema.parse(input);
  const services = validatedInput.services as Service[];
  const panels = validatedInput.panels as Panel[];

  // Find all services from different panels that match the selected service name
  const offeringServices = services.filter(s => s.name === validatedInput.serviceName);

  if (offeringServices.length === 0) {
    throw new Error('No panels found for this service.');
  }

  // Construct the list of SMM panels for the AI
  const smmPanels = offeringServices.map(service => {
    const panel = panels.find(p => p.id === service.smmPanelId);
    if (!panel) {
      // This should not happen with consistent mock data
      throw new Error(`Configuration error: Panel with id ${service.smmPanelId} not found.`);
    }
    return {
      panelName: panel.name,
      apiEndpoint: panel.apiUrl,
      pricePerUnit: service.rate / 1000,
      estimatedDeliveryTime: service.estimatedDeliveryTime,
    };
  });

  const aiInput: RouteOrderInput = {
    serviceType: validatedInput.serviceName,
    quantity: validatedInput.quantity,
    routingPreference: validatedInput.preference,
    smmPanels,
  };

  try {
    const result = await routeOrder(aiInput);
    return result;
  } catch (error) {
    console.error("AI routing failed:", error);
    throw new Error("Failed to get a recommendation from the AI service.");
  }
}
