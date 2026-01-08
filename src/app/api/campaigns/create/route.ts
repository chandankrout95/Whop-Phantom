import { connectDB } from "@/lib/db";
import { Campaign } from "@/models/Campaign";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const campaign = await Campaign.create({
    campaignId: body.campaignId,
    link: body.link,
    serviceId: body.serviceId,
    totalQuantity: body.totalQuantity,
    min: body.min,
    max: body.max,
    intervalMs: body.intervalMs,
    status: "processing",
  });

  return NextResponse.json({ success: true, campaignId: campaign._id });
}
