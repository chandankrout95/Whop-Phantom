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
import type { Order, Service, Panel } from "@/lib/types";
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, orderBy, limit, collectionGroup } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';


export function RecentOrders() {
  const { firestore, user } = useFirebase();

  const ordersRef = useMemo(() => user && firestore ? query(collection(firestore, `users/${user.uid}/orders`), orderBy('createdAt', 'desc'), limit(5)) : null, [firestore, user]);
  const { data: recentOrders, isLoading: ordersLoading } = useCollection<Order>(ordersRef);

  const servicesQuery = useMemo(() => firestore ? query(collectionGroup(firestore, 'services')) : null, [firestore]);
  const { data: services, isLoading: servicesLoading } = useCollection<Service>(servicesQuery);

  const panelsRef = useMemo(() => firestore ? collection(firestore, 'smm_panels') : null, [firestore]);
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
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>A list of your most recent orders.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
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
                      <div className="font-medium">{service?.name}</div>
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
        )}
      </CardContent>
    </Card>
  );
}
