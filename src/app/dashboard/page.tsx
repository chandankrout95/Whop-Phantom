'use client';
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { RecentOrders } from "@/components/dashboard/recent-orders";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <OverviewCards />
      <RecentOrders />
    </div>
  );
}
