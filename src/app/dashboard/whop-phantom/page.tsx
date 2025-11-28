
'use client';

import { HackerBackground } from '@/components/hacker-background';

export default function WhopPhantomPage() {
  return (
    <div className="relative flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-8 overflow-hidden rounded-lg border border-primary/20 bg-black p-8">
      <HackerBackground />
      <div className="relative z-10">
        {/* The title has been moved to the header */}
      </div>
    </div>
  );
}
