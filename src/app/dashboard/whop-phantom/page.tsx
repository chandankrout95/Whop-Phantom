
'use client';

import { HackerBackground } from '@/components/hacker-background';
import { WhopPhantomForm } from '@/components/dashboard/whop-phantom-form';
import { CampaignHistory } from '@/components/dashboard/campaign-history';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function WhopPhantomPage() {
  return (
    <div className="relative h-[calc(100vh-10rem)] overflow-hidden rounded-lg border-primary/20 bg-black">
      <HackerBackground />
      <ScrollArea className="h-full w-full">
        <div className="relative z-10 flex flex-col min-h-full w-full items-center justify-start p-4 md:p-8 gap-8">
          <div className="w-full max-w-2xl">
            <WhopPhantomForm />
          </div>
          <div className="w-full max-w-2xl">
            <CampaignHistory />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
