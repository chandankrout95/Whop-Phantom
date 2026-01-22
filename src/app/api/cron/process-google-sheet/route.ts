import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Campaign } from "@/models/Campaign";
import { getSheetRows, updateSheetStatus } from "@/lib/googleSheet";
import { placeSmmOrder } from "@/lib/smm";

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    await dbConnect();
    const activeCampaigns = await Campaign.find({ status: "active" });

    for (const campaign of activeCampaigns) {
      try {
        const sheetId = campaign.sheetUrl.split("/d/")[1]?.split("/")[0];
        const sheetName = (campaign.sheetName || "insta").toLowerCase();
        if (!sheetId) continue;

        const rows = await getSheetRows(sheetId, sheetName);

        const config = sheetName.includes("tiktok")
          ? [
              { s: 0, l: 1, q: 2 },
              { s: 6, l: 7, q: 8 },
            ]
          : [
              { s: 0, l: 1, q: 2 },
              { s: 6, l: 7, q: 8 },
              { s: 12, l: 13, q: 14 },
              { s: 18, l: 19, q: 20 },
            ];

        const alreadyApproved = rows.some((row) => row[5] === "APPROVED");

        const totalCompletedValue = rows.reduce((acc, row) => {
          if (row[3] === "completed") {
            const val = parseFloat(String(row[2]).replace(/[^0-9.]/g, "")) || 0;
            return acc + val;
          }
          return acc;
        }, 0);

        const targetRowIndex = rows.findIndex((row) => {
          const serviceId = row[config[0].s];
          const status = row[3] ? String(row[3]).trim() : "";
          return serviceId && status === "";
        });

        if (targetRowIndex === -1) continue;

        const currentRow = rows[targetRowIndex];
        const sheetRowNumber = targetRowIndex + 3;

        const currentVal =
          parseFloat(String(currentRow[2]).replace(/[^0-9.]/g, "")) || 0;
        const shouldApproveNow =
          !alreadyApproved && totalCompletedValue + currentVal >= 2000;

        const finalResults = [];
        for (const mapping of config) {
          const sId = currentRow[mapping.s];
          const link = currentRow[mapping.l];
          const qty = currentRow[mapping.q];

          if (sId && String(sId).trim() !== "" && String(sId) !== "0") {
            const res = await placeSmmOrder({
              serviceId: String(sId),
              link: String(link),
              quantity: Number(qty) || 0,
            });

            finalResults.push({
              status: res.success ? "completed" : "failed",
              orderId: res.success ? String(res.orderId) : res.error || "Error",
            });
          } else {
            finalResults.push({ status: "skipped", orderId: "No Data" });
          }
        }

        await updateSheetStatus(
          sheetId,
          sheetRowNumber,
          finalResults,
          sheetName,
          shouldApproveNow,
        );
      } catch (innerError: any) {
        console.error(`Error in ${campaign.sheetName}:`, innerError.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
