
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
import type { Order } from "@/lib/types";
import { mockOrders } from '@/lib/mock-data';

export function CampaignHistory() {
  const campaigns: Order[] = mockOrders.slice(0, 3); // Using mock orders as campaign data

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
  
  const formatDate = (dateValue: any) => {
    if (!dateValue) return '';
    if (typeof dateValue === 'string') {
        return new Date(dateValue).toLocaleDateString();
    }
    return new Date(dateValue).toLocaleDateString();
  }

  return (
    <Card className="bg-background/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground">Views Campaign History</CardTitle>
        <CardDescription>A log of your recent botting campaigns.</CardDescription>
      </CardHeader>
      <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns?.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="font-medium">Campaign {campaign.id.slice(-3)}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {campaign.link}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(campaign.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusVariant(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
      </CardContent>
    </Card>
  );
}
