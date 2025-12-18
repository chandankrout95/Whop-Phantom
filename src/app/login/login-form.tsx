
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const loginSchema = z.object({
  authToken: z.string().min(1, 'Auth Token is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [masterKeyAttempts, setMasterKeyAttempts] = useState(0);
  const [isPermanentlyLocked, setIsPermanentlyLocked] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      authToken: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    if (isPermanentlyLocked) {
      setError('System locked. Contact dealer.');
      setIsLoading(false);
      return;
    }

    if (isLocked) {
      // Master key logic
      if (data.authToken.includes('STU')) {
        setAttempts(0);
        setIsLocked(false);
        setMasterKeyAttempts(0);
        setError('Master key accepted. You may try the primary token again.');
        form.reset();
      } else {
        const newMasterKeyAttempts = masterKeyAttempts + 1;
        setMasterKeyAttempts(newMasterKeyAttempts);
        if (newMasterKeyAttempts >= 3) {
          setIsPermanentlyLocked(true);
          setError('System permanently locked due to multiple invalid master key attempts. Contact dealer.');
        } else {
          setError(`Invalid master key. ${3 - newMasterKeyAttempts} attempts remaining.`);
        }
      }
      setIsLoading(false);
      return;
    }

    // Primary auth token logic
    if (data.authToken.includes('NKU')) {
      try {
        await login('user@phantom.net', data.authToken);
        // The redirect is handled by the auth hook
      } catch (e: any) {
        setError(e.message);
        setIsLoading(false);
      }
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setIsLocked(true);
        setError('Too many failed attempts. System locked. Enter master key to unlock.');
      } else {
        setError(`Wrong auth token. ${3 - newAttempts} attempts remaining.`);
      }
      setIsLoading(false);
    }
  };

  const getLabel = () => {
    if (isPermanentlyLocked) return 'System Locked';
    if (isLocked) return 'Master Key';
    return 'Auth Token';
  }

  const getButtonText = () => {
    if (isPermanentlyLocked) return 'Locked';
    if (isLocked) return 'Unlock';
    return 'Authenticate';
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
            <Alert variant="destructive">
                <AlertTitle>{isLocked ? 'System Locked' : 'Access Denied'}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <FormField
          control={form.control}
          name="authToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getLabel()}</FormLabel>
              <FormControl>
                <Input type="password" {...field} disabled={isPermanentlyLocked} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit" className="w-full" disabled={isLoading || isPermanentlyLocked}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {getButtonText()}
          </Button>
        </div>
      </form>
    </Form>
  );
}
