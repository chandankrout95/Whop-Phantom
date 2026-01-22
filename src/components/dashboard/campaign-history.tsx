'use client';

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store"; // adjust the path to your store
import type { Order } from "@/store/campaignSlice"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "../ui/progress";
import { MoreVertical, Pause, Play, Power, RefreshCcw, Shield, ShieldAlert, ShieldCheck, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const AntiCheatIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'SAFE': return <ShieldCheck className="h-5 w-5 text-green-500" />;
        case 'MONITORING': return <Shield className="h-5 w-5 text-yellow-500 animate-pulse" />;
        case 'DETECTED': return <ShieldAlert className="h-5 w-5 text-red-500 animate-pulse" />;
        default: return <Shield className="h-5 w-5 text-gray-500" />;
    }
}

const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed": return "default";
      case "In Progress": return "secondary";
      case "Paused": return "outline";
      case "Stopped":
      case "Canceled": return "destructive";
      default: return "outline";
    }
}

const CampaignRow = ({ campaign, onAction }: { campaign: Order; onAction: (id: string, action: any) => void; }) => {
    const [countdown, setCountdown] = useState(0);
    
    // SAFE DATA PARSING
    const isDripFeed = !!campaign.dripFeed;
    const totalQuantity = campaign.quantity ?? 0;
    const currentDelivered = isDripFeed ? (campaign.dripFeed?.totalOrdered ?? 0) : (campaign.sent ?? 0);
    const completionPercentage = campaign.progress ?? 0;
    
    useEffect(() => {
        if (campaign.status !== 'In Progress') {
            setCountdown(0);
            return;
        }

        const calculateCountdown = () => {
            if (isDripFeed && campaign.dripFeed?.nextRun) {
                const now = Date.now();
                const next = campaign.dripFeed.nextRun;
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
                <div className="font-medium">
                    {campaign.campaignName || campaign.dripFeed?.campaignName || `Order ${campaign.id?.slice(-6) ?? 'N/A'}`}
                </div>
                <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {campaign.link || "No link provided"}
                </div>
            </TableCell>
            <TableCell className="text-center">
                {/* Fixed the toLocaleString crash by ensuring it's never undefined */}
                {totalQuantity.toLocaleString()}
            </TableCell>
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
                <Badge variant={getStatusVariant(campaign.status ?? "")}>
                    {campaign.status ?? "Pending"}
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
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onAction(campaign.id, 'edit')}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {campaign.status === 'In Progress' && (
                            <DropdownMenuItem onClick={() => onAction(campaign.id, 'pause')}>
                                <Pause className="mr-2 h-4 w-4" /> Pause
                            </DropdownMenuItem>
                        )}
                        {(campaign.status === 'Paused' || campaign.status === 'Stopped') && (
                            <DropdownMenuItem onClick={() => onAction(campaign.id, 'resume')}>
                                <Play className="mr-2 h-4 w-4" /> Resume
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onAction(campaign.id, 'stop')} className="text-destructive">
                            <Power className="mr-2 h-4 w-4" /> Stop
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}

export function CampaignHistory({ onCampaignAction }: { onCampaignAction: (id: string, action: any) => void; }) {
    const campaigns = useSelector((state: RootState) => state.campaigns.campaigns);

    return (
        <Card className="bg-background/80 backdrop-blur-sm border-border/50 h-full flex flex-col">
          <CardHeader>
            <CardTitle>Live Campaign History</CardTitle>
            <CardDescription>Real-time log of your SMM and Google Sheet tasks.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            {campaigns && campaigns.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Delivered</TableHead>
                    <TableHead className="text-center">Next</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Safety</TableHead>
                    <TableHead className="text-center">Flag</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                      <CampaignRow key={campaign.id} campaign={campaign} onAction={onCampaignAction} />
                  ))}
                </TableBody>
              </Table>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <p>No Campaigns Active</p>
                </div>
            )}
          </CardContent>
        </Card>
    );
}