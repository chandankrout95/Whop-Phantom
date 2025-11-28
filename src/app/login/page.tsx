'use client';

import { Terminal, Zap } from 'lucide-react';
import { LoginForm } from './login-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // No automatic redirection
  }, [user, isLoading, router]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 font-mono">
      <div className="w-full max-w-md space-y-8">
        <div className="w-full max-w-md rounded-lg border border-green-700/50 bg-black/50 p-4 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
            <div className="flex items-center justify-between border-b border-green-700/50 pb-2 mb-6">
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
              <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-foreground">
                Secure Access Required
              </h2>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Or{' '}
                <a
                  href="/signup"
                  className="font-medium text-primary hover:text-primary/90"
                >
                  initiate new user sequence
                </a>
              </p>
            </div>
            <div className="p-6">
                <LoginForm />
            </div>
        </div>
      </div>
    </div>
  );
}
