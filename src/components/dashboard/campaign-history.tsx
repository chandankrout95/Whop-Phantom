
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
import { useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const AntiCheatIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'SAFE':
            return <ShieldCheck className="h-5 w-5 text-green-500" />;
        case 'MONITORING':
            return <Shield className="h-5 w-5 text-yellow-500 animate-pulse" />;
        case 'DETECTED':
            return <ShieldAlert className="h-5 w-5 text-red-500 animate-pulse" />;
        default:
            return <Shield className="h-5 w-5 text-gray-500" />;
    }
}

const CampaignRow = ({ campaign }: { campaign: Order }) => {
    const [delivered, setDelivered] = useState(0);
    const [countdown, setCountdown] = useState(0);

    const isDripFeed = !!campaign.dripFeed;
    const totalQuantity = isDripFeed ? campaign.dripFeed!.totalViews : campaign.quantity;
    const currentDelivered = isDripFeed ? campaign.dripFeed!.totalOrdered : delivered;
    const completionPercentage = (currentDelivered / totalQuantity) * 100;
    
    useEffect(() => {
        if (!isDripFeed) {
            const deliveredInterval = setInterval(() => {
                if (campaign.status === 'Completed') {
                    setDelivered(campaign.quantity);
                    clearInterval(deliveredInterval);
                    return;
                }
                 if (campaign.status !== 'In Progress') {
                    clearInterval(deliveredInterval);
                    return;
                }
                setDelivered(d => {
                    const next = d + Math.floor(Math.random() * (campaign.quantity/20));
                    return next > campaign.quantity ? campaign.quantity : next;
                });
            }, 1000 + Math.random() * 1000);
            return () => clearInterval(deliveredInterval);
        }
    }, [campaign.quantity, campaign.status, isDripFeed]);

     useEffect(() => {
        if (campaign.status !== 'In Progress') {
            setCountdown(0);
            return;
        }

        const calculateCountdown = () => {
            if (isDripFeed) {
                const now = Date.now();
                const next = campaign.dripFeed!.nextRun;
                const diff = Math.max(0, Math.floor((next - now) / 1000));
                setCountdown(diff);
            } else {
                 setCountdown(c => (c > 0 ? c - 1 : Math.floor(Math.random() * 30) + 30));
            }
        };
        
        calculateCountdown();
        const countdownInterval = setInterval(calculateCountdown, 1000);
        return () => clearInterval(countdownInterval);
    }, [campaign, isDripFeed]);


    return (
        <TableRow>
            <TableCell>
                <div className="font-medium">{campaign.dripFeed?.campaignName || `Order ${campaign.id.slice(-6)}`}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[150px]">{campaign.link}</div>
            </TableCell>
            <TableCell className="text-center">{totalQuantity.toLocaleString()}</TableCell>
            <TableCell>
                <div className="flex flex-col gap-1 items-center">
                    <span>{currentDelivered.toLocaleString()}</span>
                    <Progress value={completionPercentage} className="h-1 w-24" />
                </div>
            </TableCell>
            <TableCell className="text-center">
                {campaign.status === 'In Progress' && countdown > 0 ? `${countdown}s` : '--'}
            </TableCell>
            <TableCell className="text-center">
                <Badge variant={campaign.status === 'Completed' ? 'default' : campaign.status === 'In Progress' ? 'secondary' : 'destructive'}>
                    {campaign.status}
                </Badge>
            </TableCell>
            <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                    <AntiCheatIcon status={campaign.antiCheatStatus || 'SAFE'} />
                    <span>{campaign.antiCheatStatus || 'SAFE'}</span>
                </div>
            </TableCell>
            <TableCell className="text-center">
                <span className={cn(
                    "inline-block h-3 w-3 rounded-full animate-pulse",
                    campaign.flagged ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-green-500 shadow-[0_0_8px_green]'
                )}></span>
            </TableCell>
        </TableRow>
    );
}


export function CampaignHistory({ campaigns }: { campaigns: Order[] }) {

  return (
    <Card className="bg-background/80 backdrop-blur-sm border-border/50 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-foreground">Live Campaign History</CardTitle>
        <CardDescription>A live log of your botting campaigns from this session.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        {campaigns.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead className="text-center">Total Views</TableHead>
                <TableHead className="text-center">Views Delivered</TableHead>
                <TableHead className="text-center">Next Order</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Anti-Cheat</TableHead>
                <TableHead className="text-center">Flagged</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns?.map((campaign) => (
                  <CampaignRow key={campaign.id} campaign={campaign} />
              ))}
            </TableBody>
          </Table>
        ) : (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
                <p className="text-lg font-semibold text-foreground">No Campaigns Yet</p>
                <p className="text-sm text-muted-foreground">Start a new botting task to see its history here.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
