import { connectDB } from "@/lib/db";
import { Campaign } from "@/models/Campaign";

export async function GET() {
  await connectDB();

  const campaign = await Campaign.create({
    campaignId: "TEST-123",
    link: "https://youtube.com/test",
    serviceId: "1",
    totalQuantity: 1000,
    min: 100,
    max: 200,
    intervalMs: 60000,
  });

  return Response.json({ success: true, campaign });
}
