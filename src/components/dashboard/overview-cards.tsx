'use client';
import { useMemo } from 'react';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Panel, Order } from "@/lib/types";
import { DollarSign, ListOrdered, Server, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from '../ui/skeleton';

export function OverviewCards() {
  const { firestore, user } = useFirebase();

  const panelsRef = useMemoFirebase(() => firestore ? query(collection(firestore, 'smm_panels')) : null, [firestore]);
  const { data: panels, isLoading: panelsLoading } = useCollection<Panel>(panelsRef);
  
  const ordersRef = useMemoFirebase(() => user && firestore ? query(collection(firestore, `users/${user.uid}/orders`)) : null, [firestore, user]);
  const { data: orders, isLoading: ordersLoading } = useCollection<Order>(ordersRef);

  const totalBalance = useMemo(() => panels?.reduce((sum, panel) => sum + panel.balance, 0), [panels]);
  const totalOrders = orders?.length ?? 0;
  const activePanels = panels?.length ?? 0;

  const isLoading = panelsLoading || ordersLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[126px]" />
        <Skeleton className="h-[126px]" />
        <Skeleton className="h-[126px]" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalBalance?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            Across {activePanels} panels
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ListOrdered className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            All-time order count
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Panels</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{activePanels}</div>
          <p className="text-xs text-muted-foreground">
            Connected API providers
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
