'use server';

import { z } from 'zod';

const smmOrderSchema = z.object({
  link: z.string().url(),
  quantity: z.number().min(1),
  serviceId: z.string().min(1), // API expects a string ID
});

export async function placeSmmOrder(input: z.infer<typeof smmOrderSchema>) {
  const validation = smmOrderSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: "Invalid input data." };
  }

  const apiKey = '0bc126b7730e879dd8c35a0e8c084f4c';
  const apiUrl = 'https://smmsocialmedia.in/api/v2';

  const params = new URLSearchParams({
    key: apiKey,
    action: 'add',
    service: input.serviceId.trim(),
    link: input.link.trim(),
    quantity: input.quantity.toString(),
  });
  // console.log("params" , params);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.error) return { success: false, error: data.error };
    if (!data.order) return { success: false, error: "No order ID returned from panel." };

    return { success: true, orderId: data.order };
  } catch (error) {
    return { success: false, error: "Connection to SMM panel failed." };
  }
}

export async function getSmmServices() {
  const apiKey = '0bc126b7730e879dd8c35a0e8c084f4c';
  const params = new URLSearchParams({ key: apiKey, action: 'services' });

  try {
    const response = await fetch('https://smmsocialmedia.in/api/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch services");
  }
}