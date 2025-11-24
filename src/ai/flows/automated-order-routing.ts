'use server';

/**
 * @fileOverview An AI agent for automatically routing orders to the best SMM panel based on price or delivery time.
 *
 * - routeOrder - A function that handles the order routing process.
 * - RouteOrderInput - The input type for the routeOrder function.
 * - RouteOrderOutput - The return type for the routeOrder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RouteOrderInputSchema = z.object({
  serviceType: z.string().describe('The type of service being ordered (e.g., likes, followers, views).'),
  quantity: z.number().describe('The quantity of the service being ordered.'),
  smmPanels: z.array(
    z.object({
      panelName: z.string().describe('The name of the SMM panel.'),
      apiEndpoint: z.string().describe('The API endpoint for the SMM panel.'),
      pricePerUnit: z.number().describe('The price per unit of the service on this panel.'),
      estimatedDeliveryTime: z.string().describe('The estimated delivery time for the service on this panel.'),
    })
  ).describe('An array of SMM panels to choose from, with their prices and delivery times.'),
  routingPreference: z.enum(['price', 'deliveryTime']).describe('The user preference for routing orders: either by price or delivery time.'),
});

export type RouteOrderInput = z.infer<typeof RouteOrderInputSchema>;

const RouteOrderOutputSchema = z.object({
  bestPanel: z.string().describe('The name of the SMM panel to which the order should be routed.'),
  reason: z.string().describe('The reason for choosing this panel (e.g., lowest price, fastest delivery).'),
});

export type RouteOrderOutput = z.infer<typeof RouteOrderOutputSchema>;

export async function routeOrder(input: RouteOrderInput): Promise<RouteOrderOutput> {
  return routeOrderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'routeOrderPrompt',
  input: {schema: RouteOrderInputSchema},
  output: {schema: RouteOrderOutputSchema},
  prompt: `You are an expert in social media marketing and order routing.

You will receive information about different SMM panels, their prices, and delivery times for a specific service.
Your task is to determine the best SMM panel to route the order to, based on the user's preference for either price or delivery time.

Here is the service type: {{{serviceType}}}
Here is the quantity: {{{quantity}}}

Here are the available SMM panels:
{{#each smmPanels}}
- Panel Name: {{{panelName}}}, API Endpoint: {{{apiEndpoint}}}, Price Per Unit: {{{pricePerUnit}}}, Estimated Delivery Time: {{{estimatedDeliveryTime}}}
{{/each}}

The user's routing preference is: {{{routingPreference}}}

Based on this information, determine the best SMM panel to route the order to and explain your reasoning.

Ensure that you return the panel name in the "bestPanel" field and the reason for choosing this panel in the "reason" field.

Considerations:
*   If the routing preference is "price", choose the panel with the lowest total price (price per unit * quantity).
*   If the routing preference is "deliveryTime", choose the panel with the fastest estimated delivery time.
*   If there are multiple panels with the same price or delivery time, choose the first one in the list.
`,
});

const routeOrderFlow = ai.defineFlow(
  {
    name: 'routeOrderFlow',
    inputSchema: RouteOrderInputSchema,
    outputSchema: RouteOrderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
