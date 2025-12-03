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


const smmOrderSchema = z.object({
  link: z.string().url(),
  quantity: z.number().min(1),
  serviceId: z.string().min(1),
});

export async function placeSmmOrder(input: z.infer<typeof smmOrderSchema>) {
  const validation = smmOrderSchema.safeParse(input);
  if (!validation.success) {
    throw new Error("Invalid input to place SMM order.");
  }

  const apiKey = '36bbdaa97891ea83435249ebf1151bbe';
  const apiUrl = 'https://smmsocialmedia.in/api/v2';

  const params = new URLSearchParams({
    key: apiKey,
    action: 'add',
    service: input.serviceId,
    link: input.link,
    quantity: input.quantity.toString(),
  });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("SMM API Error Response:", errorText);
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.order) {
        throw new Error("API response did not include an order ID.");
    }

    return { success: true, orderId: data.order };

  } catch (error) {
    console.error('Failed to place SMM order:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}
