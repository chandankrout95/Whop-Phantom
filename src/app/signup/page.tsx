'use client';

import { Zap } from 'lucide-react';
import { SignUpForm } from './signup-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignUpPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="flex justify-center">
            <Zap className="h-12 w-auto text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <a
              href="/login"
              className="font-medium text-primary hover:text-primary/90"
            >
              sign in to your existing account
            </a>
          </p>
        </div>

        <SignUpForm />
      </div>
    </div>
  );
}
