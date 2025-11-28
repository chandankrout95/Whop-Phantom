
'use client';

import { HackerBackground } from '@/components/hacker-background';
import { PhantomDashboard } from '@/components/dashboard/phantom-dashboard';

export default function WhopPhantomPage() {
  return (
    <div className="relative h-[calc(100vh-10rem)] overflow-hidden rounded-lg bg-black">
      <HackerBackground />
      <div className="relative z-10 flex h-full w-full items-center justify-center p-4 md:p-8">
        <PhantomDashboard />
      </div>
    </div>
  );
}
