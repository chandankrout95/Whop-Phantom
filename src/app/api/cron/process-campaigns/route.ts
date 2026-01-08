import { connectDB } from "@/lib/db";
import { Campaign } from "@/models/Campaign";
import { placeSmmOrder } from "@/lib/smm";

export async function GET() {
  try {
    await connectDB();

    const campaigns = await Campaign.find({ status: "processing" });
    const now = new Date();


    console.log("🕒 CRON STARTED:", now.toISOString());
    console.log("Processing campaigns:", campaigns.length);

    for (const c of campaigns) {
      console.log("────────────────────────────");
      console.log("Campaign ID:", c._id.toString());

      const remaining = c.totalQuantity - c.sentQuantity;

      console.log({
        total: c.totalQuantity,
        sent: c.sentQuantity,
        remaining,
        min: c.min,
        max: c.max,
        intervalMs: c.intervalMs,
        nextRunAt: c.nextRunAt,
      });

      // ✅ Mark completed
      if (remaining <= 0) {
        c.status = "completed";
        await c.save();
        console.log("✅ Campaign completed");
        continue;
      }

      // ✅ FIRST RUN ALWAYS ALLOWED
      if (c.nextRunAt && c.lastRunAt && now < c.nextRunAt) {
        console.log(
          "⏭ Skipping until:",
          c.nextRunAt.toISOString()
        );
        continue;
      }

      // ✅ VALID INTERVAL
      const intervalMs =
        typeof c.intervalMs === "number" && c.intervalMs > 0
          ? c.intervalMs
          : 60_000; // default 1 minute

      // ✅ SAFE QUANTITY
      let qty = Math.floor(
        Math.random() * (c.max - c.min + 1)
      ) + c.min;

      qty = Math.min(qty, remaining);

      if (!qty || qty <= 0) {
        console.log("❌ Invalid qty, skipping");
        continue;
      }

      console.log("🚀 Sending to SMM panel:", qty);

      // ✅ SMM REQUEST
      const res = await placeSmmOrder({
        link: c.link,
        quantity: qty,
        serviceId: c.serviceId,
      });
      // return Response.json({ ok: res });


      console.log("SMM RESPONSE:", res);

      if (!res || res.success !== true) {
        console.error("❌ SMM FAILED:", res);
        continue;
      }

      // ✅ UPDATE DB
      c.sentQuantity += qty;
      c.lastRunAt = now;
      c.nextRunAt = new Date(now.getTime() + intervalMs);

      if (c.sentQuantity >= c.totalQuantity) {
        c.status = "completed";
      }

      await c.save();

      console.log(
        `✅ Sent ${qty}, next run at ${c.nextRunAt.toISOString()}`
      );
    }

    console.log("✅ CRON FINISHED");

    return Response.json({ ok: true });
  } catch (err) {
    console.error("❌ CRON ERROR:", err);
    return Response.json({ ok: false, error: "Cron failed" }, { status: 500 });
  }
}
