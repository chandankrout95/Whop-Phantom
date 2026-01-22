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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Add these imports
import { Input } from '@/components/ui/input';
import { Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCampaign } from '@/store/campaignSlice';

const formSchema = z.object({
  sheetUrl: z
    .string()
    .url('Invalid URL')
    .refine(v => v.includes('docs.google.com/spreadsheets'), {
      message: 'Must be a Google Sheet URL',
    }),
  platform: z.string().min(1, 'Select a platform'), // Added platform validation
});

type FormValues = z.infer<typeof formSchema>;

export function WhopPhantomForm() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sheetUrl: '',
      platform: 'insta', // Default to Instagram
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const campaignId = `GS-${Date.now()}`;
    const campaignName = `${data.platform.toUpperCase()}-${new Date().toISOString()}`;

    try {
      dispatch(
        addCampaign({
          id: campaignId,
          campaignName: campaignName,
          link: data.sheetUrl,
          quantity: 0,
          sent: 0,
          progress: 0,
          status: 'In Progress',
          createdAt: new Date().toISOString(),
        })
      );

      const res = await fetch('/api/campaigns/google-sheet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          campaignName,
          sheetUrl: data.sheetUrl,
          // We pass the platform as the sheetName so the Cron can detect it
          sheetName: data.platform, 
        }),
      });

      if (!res.ok) throw new Error('Failed to create campaign');

      toast({
        title: 'Campaign Created',
        description: `Processing ${data.platform} batch sizes.`,
      });

      form.reset();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border p-4 bg-black/50">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="h-5 w-5 text-primary" />
        <h1 className="text-lg text-primary">GOOGLE_SHEET_CAMPAIGN</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* PLATFORM DROPDOWN */}
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Platform</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="insta">Instagram </SelectItem>
                    <SelectItem value="tiktok">TikTok </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sheetUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Sheet URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Campaign'}
          </Button>
        </form>
      </Form>
    </div>
  );
}