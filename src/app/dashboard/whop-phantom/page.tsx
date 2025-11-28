
'use client';

import { HackerBackground } from '@/components/hacker-background';
import { WhopPhantomForm } from '@/components/dashboard/whop-phantom-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function WhopPhantomPage() {
  return (
    <div className="relative h-[calc(100vh-10rem)] overflow-hidden rounded-lg border-primary/20 bg-black">
      <HackerBackground />
      <ScrollArea className="h-full w-full">
        <div className="relative z-10 flex min-h-full w-full items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-lg">
            <WhopPhantomForm />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
