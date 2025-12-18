
'use client';

import { Lock } from "lucide-react";

export function PageLockOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 text-center">
            <Lock className="h-16 w-16 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Page Locked</h2>
            <p className="text-muted-foreground">
                Please enter the PIN using the sidebar to unlock this page.
            </p>
        </div>
    </div>
  );
}
