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
import { Button } from "@/components/ui/button";
import type { Order, Service, Panel } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { mockServices, mockPanels } from '@/lib/mock-data';
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";


export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const services: Service[] = mockServices;
  const panels: Panel[] = mockPanels;

  useEffect(() => {
    try {
      const savedCampaigns = localStorage.getItem('phantomCampaigns');
      if (savedCampaigns) {
        setOrders(JSON.parse(savedCampaigns));
      }
    } catch (error) {
        console.error("Could not read campaigns from localStorage", error);
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

  const formatDate = (dateValue: any) => {
    if (!dateValue) return '';
    if (typeof dateValue === 'string') {
        return new Date(dateValue).toLocaleDateString();
    }
    if (dateValue instanceof Timestamp) {
      return dateValue.toDate().toLocaleDateString();
    }
    return new Date(dateValue).toLocaleDateString();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <Button asChild>
          <Link href="/dashboard/new-order">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>A complete list of all your orders and campaigns.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service / Campaign</TableHead>
                <TableHead className="hidden sm:table-cell">Panel</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Charge / Total</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => {
                const service = services?.find((s) => s.id === order.serviceId) || mockServices.find(s => s.id === order.serviceId);
                const panel = panels?.find((p) => p.id === order.panelId);
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.dripFeed?.campaignName || service?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.dripFeed ? `Total Qty: ${order.quantity.toLocaleString()}` : `Qty: ${order.quantity.toLocaleString()}`}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {panel?.name}
                    </TableCell>
                     <TableCell className="hidden md:table-cell">
                      {formatDate(order.createdAt)}
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
    </div>
  );
}
