import { z } from "zod";

export async function placeSmmOrder(input: { serviceId: string, link: string, quantity: number }) {
  const apiUrl = process.env.YOYO_SMM_API_URL || "https://yoyomedia.in/api/v2";
  const params = new URLSearchParams({
    key: process.env.YOYO_SMM_API_KEY || "",
    action: "add",
    service: input.serviceId,
    link: input.link,
    quantity: input.quantity.toString(),
  });

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      body: params,
    });

    const data = await res.json();
    
    if (data.order) {
      return { success: true, orderId: data.order };
    } else {
      return { success: false, error: data.error || "Panel Error" };
    }
  } catch (err) {
    return { success: false, error: err || "Connection to SMM failed" };
  }
}