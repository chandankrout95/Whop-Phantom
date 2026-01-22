import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Order {
  id: string;
  link: string;
  quantity: number;
  sent: number;
  progress: number;
  status: string;
  createdAt: string;
  campaignName?: string; // Added for GS campaigns
  serviceId?: string;
  charge?: number;
  panelId?: string;
  userId?: string;
  antiCheatStatus?: string;
  flagged?: boolean;
  dripFeed?: {
    campaignName?: string;
    totalOrdered: number;
    nextRun: number;
  };
}

interface CampaignState {
  campaigns: Order[];
}

const initialState: CampaignState = {
  campaigns: [],
};

const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    addCampaign: (state, action: PayloadAction<Order>) => {
      // Prevent duplicates if the user clicks twice
      const exists = state.campaigns.find(c => c.id === action.payload.id);
      if (!exists) {
        state.campaigns.unshift(action.payload);
      }
    },
    updateCampaignProgress: (
      state,
      action: PayloadAction<{
        id: string;
        sent: number;
        progress: number;
        status?: string;
      }>
    ) => {
      const campaign = state.campaigns.find(c => c.id === action.payload.id);
      if (campaign) {
        campaign.sent = action.payload.sent;
        campaign.progress = action.payload.progress;
        if (action.payload.status) campaign.status = action.payload.status;
      }
    },
    clearCampaigns: (state) => {
      state.campaigns = [];
    },
  },
});

export const { addCampaign, updateCampaignProgress, clearCampaigns } = campaignSlice.actions;
export default campaignSlice.reducer;