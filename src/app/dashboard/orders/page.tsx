'use client';

import { useMemo } from 'react';
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
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, collectionGroup } from 'firebase/firestore';


export default function OrdersPage() {
  const { firestore, user } = useFirebase();

  const ordersRef = useMemoFirebase(() => user && firestore ? query(collection(firestore, `users/${user.uid}/orders`), orderBy('createdAt', 'desc')) : null, [firestore, user]);
  const { data: orders, isLoading: ordersLoading } = useCollection<Order>(ordersRef);

  const servicesQuery = useMemoFirebase(() => firestore && user ? query(collectionGroup(firestore, 'services')) : null, [firestore, user]);
  const { data: services, isLoading: servicesLoading } = useCollection<Service>(servicesQuery);

  const panelsRef = useMemoFirebase(() => firestore && user ? collection(firestore, 'smm_panels') : null, [firestore, user]);
  const { data: panels, isLoading: panelsLoading } = useCollection<Panel>(panelsRef);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "In Progress":
        return "secondary";
      case "Pending":
        return "outline";
      case "Canceled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const isLoading = ordersLoading || servicesLoading || panelsLoading;

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
          <CardDescription>A complete list of all your orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="hidden sm:table-cell">Panel</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Charge</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => {
                const service = services?.find((s) => s.id === order.serviceId);
                const panel = panels?.find((p) => p.id === order.panelId);
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{service?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {order.quantity.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {panel?.name}
                    </TableCell>
                     <TableCell className="hidden md:table-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
