import { connectDB } from "@/lib/db";
import { Campaign } from "@/models/Campaign";
import { placeSmmOrder } from "@/lib/smm";

export async function GET() {
  await connectDB();

  const campaigns = await Campaign.find({ status: "processing" });

  const now = new Date();
  console.log("CRON STARTED");
  for (const c of campaigns) {
    console.log("Processing campaign:", c._id.toString());

    const remaining = c.totalQuantity - c.sentQuantity;
    console.log("Remaining:", remaining);

    if (remaining <= 0) {
      c.status = "completed";
      await c.save();
      continue;
    }

    // Use nextRunAt for accurate drip feed
    if (c.nextRunAt && now < c.nextRunAt) {
      continue; // Not time yet
    }
    console.log("✅ Sending order to SMM panel...");

    // Quantity to send this run
    const qty = Math.min(
      remaining,
      Math.floor(Math.random() * (c.max - c.min + 1)) + c.min
    );

    const res = await placeSmmOrder({
      link: c.link,
      quantity: qty,
      serviceId: c.serviceId,
    });

    if (!res.success) {
      console.log("SMM failed:", res.error);
      continue;
    }

    // Update DB
    c.sentQuantity += qty;
    c.lastRunAt = now;
    c.nextRunAt = new Date(now.getTime() + c.intervalMs); // NEXT run
    if (c.sentQuantity >= c.totalQuantity) {
      c.status = "completed";
    }
    await c.save();

    console.log(`Sent ${qty} for campaign ${c.campaignId}, next run at ${c.nextRunAt}`);
  }

  return Response.json({ ok: true });
}
