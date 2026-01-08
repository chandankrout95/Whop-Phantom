import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  campaignId: String,
  link: String,
  serviceId: String,

  totalQuantity: Number,
  sentQuantity: { type: Number, default: 0 },

  min: Number,
  max: Number,
  intervalMs: Number,
  nextRunAt: Date, // ← new field

  status: { type: String, default: "processing" },
  lastRunAt: Date,

  createdAt: { type: Date, default: Date.now },
});

export const Campaign =
  mongoose.models.Campaign ||
  mongoose.model("Campaign", CampaignSchema);
