import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Campaign } from "@/models/Campaign";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const { campaignId, campaignName, sheetUrl, sheetName } = body;

    if (!sheetUrl) {
      return NextResponse.json(
        { success: false, error: "Missing sheetUrl" },
        { status: 400 },
      );
    }

    const newCampaign = await Campaign.create({
      campaignId,
      campaignName,
      sheetUrl,
      sheetName: sheetName || "Sheet1",
      status: "active",
    });

    return NextResponse.json(
      {
        success: true,
        data: newCampaign,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("MongoDB Save Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
