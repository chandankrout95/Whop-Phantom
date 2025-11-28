'use client';

import { HackerBackground } from '@/components/hacker-background';
import { PhantomDashboard } from '@/components/dashboard/phantom-dashboard';
import { WhopPhantomForm } from '@/components/dashboard/whop-phantom-form';

export default function WhopPhantomPage() {
  return (
    <div className="relative h-[calc(100vh-10rem)] overflow-hidden rounded-lg bg-black">
      <HackerBackground />
      <div className="relative z-10 grid h-full w-full grid-cols-1 items-start gap-4 p-4 md:grid-cols-2 md:p-8">
        <WhopPhantomForm />
        <PhantomDashboard />
      </div>
    </div>
  );
}
