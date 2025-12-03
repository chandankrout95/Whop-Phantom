'use client';

import { HackerBackground } from '@/components/hacker-background';
import { PhantomDashboard } from '@/components/dashboard/phantom-dashboard';
import { WhopPhantomForm } from '@/components/dashboard/whop-phantom-form';
import { CampaignHistory } from '@/components/dashboard/campaign-history';
import { useState } from 'react';
import type { Order } from '@/lib/types';

export default function WhopPhantomPage() {
  const [campaigns, setCampaigns] = useState<Order[]>([]);

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
