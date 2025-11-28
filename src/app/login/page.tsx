
'use client';

import { Terminal } from 'lucide-react';
import { LoginForm } from './login-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HackerBackground } from '@/components/hacker-background';
import { CobraAnimation } from '@/components/cobra-animation';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // No automatic redirection
  }, [user, isLoading, router]);


  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 font-mono">
      <HackerBackground />
      <div className="relative z-10 w-full max-w-sm space-y-4 text-center">

        <CobraAnimation />
        
        <h1 className="text-5xl font-bold text-primary animate-pulse" style={{ textShadow: '0 0 10px hsl(var(--primary))' }}>
          Whop Phantom
        </h1>


        <div className="w-full max-w-sm rounded-lg border border-green-700/50 bg-black/50 p-3 shadow-[0_0_20px_rgba(0,255,0,0.2)] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-green-700/50 pb-2 mb-4">
                <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    <h1 className="text-lg text-primary">AUTH_TERMINAL</h1>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                </div>
            </div>
            <div>
              <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-foreground">
                Secure Access Required
              </h2>
            </div>
            <div className="p-4">
                <LoginForm />
            </div>
        </div>
      </div>
    </div>
  );
}
