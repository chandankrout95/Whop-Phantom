'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Order, Service, Panel } from "@/lib/types";
import { mockServices, mockPanels } from '@/lib/mock-data';
import { useEffect, useState } from "react";


export function RecentOrders() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const services: Service[] = mockServices;
  const panels: Panel[] = mockPanels;

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('phantomCampaigns');
      if (savedOrders) {
        const allOrders = JSON.parse(savedOrders);
        // Sort by date and take the most recent 5
        const sortedOrders = allOrders.sort((a: Order, b: Order) => new Date(b.createdAt.toString()).getTime() - new Date(a.createdAt.toString()).getTime());
        setRecentOrders(sortedOrders.slice(0, 5));
      }
    } catch (error) {
      console.error('Could not read orders from localStorage', error);
    }
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "In Progress":
        return "secondary";
      case "Pending":
      case "Paused":
        return "outline";
      case "Canceled":
      case "Stopped":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>A list of your most recent orders.</CardDescription>
      </CardHeader>
      <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="hidden md:table-cell">Panel</TableHead>
                <TableHead className="text-right">Charge</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders?.map((order) => {
                const service = services?.find((s) => s.id === order.serviceId);
                const panel = panels?.find((p) => p.id === order.panelId);
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.dripFeed?.campaignName || service?.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        Qty: {order.quantity.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {panel?.name}
                    </TableCell>
                    <TableCell className="text-right">
                      ${order.charge.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
      </CardContent>
    </Card>
  );
}
