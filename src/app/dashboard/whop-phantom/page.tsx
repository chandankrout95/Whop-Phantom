
'use client';

import { HackerBackground } from '@/components/hacker-background';
import { PhantomDashboard } from '@/components/dashboard/phantom-dashboard';
import { WhopPhantomForm } from '@/components/dashboard/whop-phantom-form';
import { CampaignHistory } from '@/components/dashboard/campaign-history';
import { useState, useEffect, useCallback } from 'react';
import type { Order } from '@/lib/types';
import { placeSmmOrder } from '@/app/dashboard/actions';
import { useToast } from '@/hooks/use-toast';

export default function WhopPhantomPage() {
  const [campaigns, setCampaigns] = useState<Order[]>([]);
  const { toast } = useToast();

  const handleCampaignAction = useCallback((campaignId: string, action: 'pause' | 'resume' | 'stop' | 'restart') => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        switch (action) {
          case 'pause':
            return { ...c, status: 'Paused' };
          case 'resume':
            // Recalculate nextRun to avoid immediate trigger if paused for a long time
            const interval = c.dripFeed ? parseInt(c.dripFeed.timeInterval) * 60 * 1000 : 0;
            return { 
                ...c, 
                status: 'In Progress', 
                dripFeed: c.dripFeed ? { ...c.dripFeed, nextRun: Date.now() + interval } : undefined 
            };
          case 'stop':
            return { ...c, status: 'Stopped' };
          case 'restart':
             if (!c.dripFeed) return c;
             return {
                ...c,
                status: 'In Progress',
                dripFeed: {
                    ...c.dripFeed,
                    totalOrdered: 0,
                    runs: 0,
                    nextRun: Date.now(),
                }
             }
        }
      }
      return c;
    }));
  }, []);

  useEffect(() => {
    const processCampaigns = async () => {
      const now = Date.now();
      let updated = false;
      const campaignsToProcess = campaigns.filter(c => c.status === 'In Progress' && c.dripFeed && c.dripFeed.nextRun <= now);

      for (const campaign of campaignsToProcess) {
        if (!campaign.dripFeed || campaign.dripFeed.totalOrdered >= campaign.dripFeed.totalViews) {
            setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: 'Completed' } : c));
            updated = true;
            continue;
        }

        const drip = campaign.dripFeed;
        const quantity = Math.floor(Math.random() * (drip.quantityTo - drip.quantityFrom + 1) + drip.quantityFrom);
        let quantityToOrder = quantity;

        if (drip.totalOrdered + quantity > drip.totalViews) {
            quantityToOrder = drip.totalViews - drip.totalOrdered;
        }

        if (quantityToOrder <= 0) {
             setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: 'Completed' } : c));
             updated = true;
             continue;
        }

        console.log(`Placing order for campaign ${campaign.id}: ${quantityToOrder} views`);

        try {
            const result = await placeSmmOrder({
                link: campaign.link,
                quantity: quantityToOrder,
                serviceId: campaign.serviceId,
            });

            if (result.success) {
                toast({
                    title: "Drip-Feed Order Placed",
                    description: `Order ID ${result.orderId} for ${quantityToOrder} views placed for campaign ${campaign.id}.`,
                });

                setCampaigns(prev => prev.map(c => {
                    if (c.id === campaign.id && c.dripFeed) {
                        const newTotalOrdered = c.dripFeed.totalOrdered + quantityToOrder;
                        const newStatus = newTotalOrdered >= c.dripFeed.totalViews ? 'Completed' : 'In Progress';
                        return {
                            ...c,
                            status: newStatus,
                            dripFeed: {
                                ...c.dripFeed,
                                totalOrdered: newTotalOrdered,
                                nextRun: Date.now() + (parseInt(c.dripFeed.timeInterval) * 60 * 1000),
                                runs: c.dripFeed.runs + 1,
                            }
                        };
                    }
                    return c;
                }));
                updated = true;

            } else {
                 throw new Error(result.error || 'An unknown error occurred.');
            }
        } catch(error: any) {
             toast({
                title: "Drip-Feed Order Failed",
                description: error.message,
                variant: 'destructive'
            });
             setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: 'Stopped' } : c));
             updated = true;
        }
      }
    };
    
    const interval = setInterval(processCampaigns, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [campaigns, toast]);

  return (
    <div className="relative min-h-screen overflow-hidden rounded-lg bg-black">
      <HackerBackground />
      <div className="relative z-10 flex h-full flex-col gap-4 p-4 md:p-8">
        <div className="grid flex-shrink-0 grid-cols-1 items-start gap-4 md:grid-cols-2">
          <div className="h-[90vh] overflow-hidden">
            <WhopPhantomForm setCampaigns={setCampaigns} />
          </div>
          <div className="h-[90vh] overflow-hidden">
            <PhantomDashboard />
          </div>
        </div>
        <div className="flex-grow overflow-hidden">
          <CampaignHistory campaigns={campaigns} onCampaignAction={handleCampaignAction} />
        </div>
      </div>
    </div>
  );
}
