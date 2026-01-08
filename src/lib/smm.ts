import { z } from "zod";

const smmOrderSchema = z.object({
  link: z.string().url(),
  quantity: z.number().min(1),
  serviceId: z.string(),
});

export async function placeSmmOrder(input: z.infer<typeof smmOrderSchema>) {
  const parsed = smmOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const params = new URLSearchParams({
    key: '0bc126b7730e879dd8c35a0e8c084f4c',
    action: "add",
    service: input.serviceId,
    link: input.link,
    quantity: input.quantity.toString(),
  });

  try {
    const res = await fetch("https://smmsocialmedia.in/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await res.json();
    if (!data.order) return { success: false, error: data.error };

    return { success: true, orderId: data.order };
  } catch {
    return { success: false, error: "Network error" };
  }
}
