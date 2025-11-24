'use client';

import { Zap } from 'lucide-react';
import { LoginForm } from './login-form';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="flex justify-center">
            <Zap className="h-12 w-auto text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <a
              href="/signup"
              className="font-medium text-primary hover:text-primary/90"
            >
              create a new account
            </a>
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
