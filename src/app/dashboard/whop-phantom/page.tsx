'use client';

import { HackerBackground } from '@/components/hacker-background';
import { PhantomDashboard } from '@/components/dashboard/phantom-dashboard';
import { WhopPhantomForm } from '@/components/dashboard/whop-phantom-form';
import { CampaignHistory } from '@/components/dashboard/campaign-history';
import { useState, useEffect } from 'react';
import type { Order } from '@/lib/types';
import { placeSmmOrder } from '@/app/dashboard/actions';
import { useToast } from '@/hooks/use-toast';

export default function WhopPhantomPage() {
  const [campaigns, setCampaigns] = useState<Order[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prevCampaigns => {
        const updatedCampaigns = [...prevCampaigns];
        let wasUpdated = false;

        updatedCampaigns.forEach((campaign, index) => {
          if (campaign.status === 'In Progress' && campaign.dripFeed && campaign.dripFeed.nextRun <= Date.now()) {
            
            const drip = campaign.dripFeed;
            
            if (drip.totalOrdered < drip.totalViews) {
                wasUpdated = true;
                
                const quantity = Math.floor(Math.random() * (drip.quantityTo - drip.quantityFrom + 1) + drip.quantityFrom);
                let quantityToOrder = quantity;

                if(drip.totalOrdered + quantity > drip.totalViews) {
                    quantityToOrder = drip.totalViews - drip.totalOrdered;
                }

                console.log(`Placing order for campaign ${campaign.id}: ${quantityToOrder} views`);
                
                placeSmmOrder({
                    link: campaign.link,
                    quantity: quantityToOrder,
                    serviceId: campaign.serviceId,
                }).then(result => {
                    if(result.success) {
                        toast({
                            title: "Drip-Feed Order Placed",
                            description: `Order for ${quantityToOrder} views placed for campaign ${campaign.id}.`,
                        });
                    } else {
                        toast({
                            title: "Drip-Feed Order Failed",
                            description: result.error || 'An unknown error occurred.',
                            variant: 'destructive'
                        });
                    }
                });

                updatedCampaigns[index] = {
                    ...campaign,
                    dripFeed: {
                        ...drip,
                        totalOrdered: drip.totalOrdered + quantityToOrder,
                        nextRun: Date.now() + (parseInt(drip.timeInterval) * 60 * 1000),
                        runs: drip.runs + 1,
                    }
                };

                if (updatedCampaigns[index].dripFeed!.totalOrdered >= drip.totalViews) {
                    updatedCampaigns[index].status = 'Completed';
                }

            } else {
                 if (campaign.status !== 'Completed') {
                    wasUpdated = true;
                    updatedCampaigns[index] = { ...campaign, status: 'Completed' };
                 }
            }
          }
        });

        return wasUpdated ? updatedCampaigns : prevCampaigns;
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [toast]);

  return (
    <div className="relative min-h-screen overflow-hidden rounded-lg bg-black">
      <HackerBackground />
      <div className="relative z-10 flex h-full flex-col gap-4 p-4 md:p-8">
        <div className="grid flex-shrink-0 grid-cols-1 items-start gap-4 md:grid-cols-2">
          <div className="h-[90vh] overflow-hidden">
            <WhopPhantomForm campaigns={campaigns} setCampaigns={setCampaigns} />
          </div>
          <div className="h-[90vh] overflow-hidden">
            <PhantomDashboard />
          </div>
        </div>
        <div className="flex-grow overflow-hidden">
          <CampaignHistory campaigns={campaigns} />
        </div>
      </div>
    </div>
  );
}
