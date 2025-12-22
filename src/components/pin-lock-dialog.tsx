
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const DEFAULT_PIN = '578';

export function PinLockDialog({
  isOpen,
  onOpenChange,
  onSuccess,
  correctPin = DEFAULT_PIN,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  correctPin?: string;
}) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleVerifyPin = () => {
    if (pin === correctPin) {
      setError(null);
      setPin('');
      onSuccess();
    } else {
      setError('Incorrect PIN. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black text-foreground border-primary/50">
        <DialogHeader>
          <DialogTitle>PIN Required</DialogTitle>
          <DialogDescription>
            This area is protected. Please enter the PIN to proceed.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="text-center text-2xl tracking-widest"
          />
          <Button onClick={handleVerifyPin} className="w-full">
            Unlock
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
