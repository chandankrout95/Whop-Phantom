import { FieldValue } from "firebase/firestore";

export type Panel = {
  id: string;
  name: string;
  balance: number;
  apiUrl: string;
  apiKey: string;
};

export type Service = {
  id: string;
  name: string;
  category: string;
  rate: number; // per 1000
  min: number;
  max: number;
  smmPanelId: string;
  estimatedDeliveryTime: string; // e.g., "24 hours", "1-2 days"
};

type DripFeedData = {
    campaignName: string;
    videoLink: string;
    serviceId: string;
    totalViews: number;
    variant: "standard" | "hq" | "premium";
    quantityFrom: number;
    quantityTo: number;
    timeInterval: string;
    totalOrdered: number;
    runs: number;
    nextRun: number;
}


export type Order = {
  id: string;
  serviceId: string;
  link: string;
  quantity: number;
  charge: number;
  createdAt: FieldValue | string;
  status: "Pending" | "In Progress" | "Completed" | "Canceled" | "Partial" | "Paused" | "Stopped";
  panelId: string;
  userId: string;
  antiCheatStatus?: 'SAFE' | 'MONITORING' | 'DETECTED';
  flagged?: boolean;
  dripFeed?: DripFeedData;
};

export type NavItem = {
  href: string;
  title: string;
  icon: React.ElementType;
  active?: boolean;
}
