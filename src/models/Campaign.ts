import mongoose, { Schema, model, models } from 'mongoose';

const CampaignSchema = new Schema({
  campaignId: { type: String }, // The GS-123456 ID from frontend
  campaignName: { type: String }, // "GoogleSheet-..."
  sheetUrl: { type: String, required: true },
  sheetName: { type: String, default: 'view' },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'paused', 'failed'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
});

export const Campaign = models.Camp || model('Camp', CampaignSchema);