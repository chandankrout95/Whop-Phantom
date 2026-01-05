import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Order {
  id: string;
  link: string;
  quantity: number;
  status: string;
  createdAt: string;
  serviceId: string;
  charge: number;
  panelId: string;
  userId: string;
  antiCheatStatus: string;
  flagged: boolean;
  dripFeed?: any;
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
      state.campaigns.unshift(action.payload);
    },
    clearCampaigns: (state) => {
      state.campaigns = [];
    },
  },
});

export const { addCampaign, clearCampaigns } = campaignSlice.actions;
export default campaignSlice.reducer;
