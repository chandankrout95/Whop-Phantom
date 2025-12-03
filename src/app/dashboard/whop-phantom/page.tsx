
'use client';

import { HackerBackground } from '@/components/hacker-background';
import { PhantomDashboard } from '@/components/dashboard/phantom-dashboard';
import { WhopPhantomForm } from '@/components/dashboard/whop-phantom-form';
import { CampaignHistory } from '@/components/dashboard/campaign-history';
import { useState, useEffect, useCallback } from 'react';
import type { Order } from '@/lib/types';
import { placeSmmOrder } from '@/app/dashboard/actions';
import { useToast } from '@/hooks/use-toast';
import { EditCampaignForm } from '@/components/dashboard/edit-campaign-form';

export default function WhopPhantomPage() {
  const [campaigns, setCampaigns] = useState<Order[]>([]);
  const { toast } = useToast();
  const [editingCampaign, setEditingCampaign] = useState<Order | null>(null);


  useEffect(() => {
    try {
      const savedCampaigns = localStorage.getItem('phantomCampaigns');
      if (savedCampaigns) {
        setCampaigns(JSON.parse(savedCampaigns));
      }
    } catch (error) {
        console.error("Could not read campaigns from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('phantomCampaigns', JSON.stringify(campaigns));
    } catch (error) {
        console.error("Could not save campaigns to localStorage", error);
    }
  }, [campaigns]);


  const handleCampaignAction = useCallback((campaignId: string, action: 'pause' | 'resume' | 'stop' | 'restart' | 'edit') => {
    if (action === 'edit') {
      const campaignToEdit = campaigns.find(c => c.id === campaignId);
      if (campaignToEdit) {
        setEditingCampaign(campaignToEdit);
      }
      return;
    }

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
  }, [campaigns]);

  const handleUpdateCampaign = (updatedCampaign: Order) => {
    setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
    setEditingCampaign(null);
    toast({
      title: "Campaign Updated",
      description: `Campaign "${updatedCampaign.dripFeed?.campaignName}" has been updated.`,
    });
  }


  useEffect(() => {
    const processCampaigns = async () => {
      const now = Date.now();
      
      const campaignToProcess = campaigns.find(c => 
        c.status === 'In Progress' && 
        c.dripFeed && 
        c.dripFeed.nextRun <= now &&
        c.dripFeed.totalOrdered < c.quantity
      );

      if (!campaignToProcess || !campaignToProcess.dripFeed) {
        return;
      }
      
      const campaignId = campaignToProcess.id;
      const drip = campaignToProcess.dripFeed;
      
      setCampaigns(prev => prev.map(c => 
          c.id === campaignId && c.dripFeed 
          ? { ...c, dripFeed: { ...c.dripFeed, nextRun: now + 5000 } } 
          : c
      ));

      const quantity = Math.floor(Math.random() * (drip.quantityTo - drip.quantityFrom + 1) + drip.quantityFrom);
      let quantityToOrder = quantity;

      if (drip.totalOrdered + quantity > campaignToProcess.quantity) {
        quantityToOrder = campaignToProcess.quantity - drip.totalOrdered;
      }

      if (quantityToOrder <= 0) {
        setCampaigns(prev => prev.map(c => 
          c.id === campaignId ? { ...c, status: 'Completed' } : c
        ));
        return;
      }

      console.log(`Placing order for campaign ${campaignId}: ${quantityToOrder} views`);

      try {
        const result = await placeSmmOrder({
          link: campaignToProcess.link,
          quantity: quantityToOrder,
          serviceId: campaignToProcess.serviceId,
        });

        if (result.success) {
          toast({
            title: "Drip-Feed Order Placed",
            description: `Order ID ${result.orderId} for ${quantityToOrder} views placed for campaign ${campaignId}.`,
          });

          setCampaigns(prev => prev.map(c => {
            if (c.id === campaignId && c.dripFeed) {
              const newTotalOrdered = c.dripFeed.totalOrdered + quantityToOrder;
              const newStatus = newTotalOrdered >= c.quantity ? 'Completed' : 'In Progress';
              const timeIntervalMs = parseInt(c.dripFeed.timeInterval) * 60 * 1000;
              return {
                ...c,
                status: newStatus,
                dripFeed: {
                  ...c.dripFeed,
                  totalOrdered: newTotalOrdered,
                  nextRun: Date.now() + timeIntervalMs,
                  runs: c.dripFeed.runs + 1,
                }
              };
            }
            return c;
          }));
        } else {
          throw new Error(result.error || 'An unknown error occurred.');
        }
      } catch(error: any) {
        toast({
          title: "Drip-Feed Order Failed",
          description: `Campaign ${campaignId}: ${error.message}`,
          variant: 'destructive'
        });
        setCampaigns(prev => prev.map(c => 
          c.id === campaignId ? { ...c, status: 'Stopped' } : c
        ));
      }
    };
    
    const interval = setInterval(processCampaigns, 2000);
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
      {editingCampaign && (
        <EditCampaignForm
          campaign={editingCampaign}
          onUpdate={handleUpdateCampaign}
          onOpenChange={() => setEditingCampaign(null)}
        />
      )}
    </div>
  );
}
