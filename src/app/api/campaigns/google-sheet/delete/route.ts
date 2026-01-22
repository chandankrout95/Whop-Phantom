import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Campaign } from "@/models/Campaign";

export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const { sheetUrl } = await req.json();

    if (!sheetUrl) {
      return NextResponse.json(
        { error: "Google Sheet URL is required" },
        { status: 400 },
      );
    }

    const deletedCampaign = await Campaign.findOneAndDelete({
      sheetUrl: sheetUrl,
    });

    if (!deletedCampaign) {
      return NextResponse.json(
        { error: "No active campaign found for this Sheet URL" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Campaign terminated and removed from database.",
      campaignName: deletedCampaign.campaignName,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
