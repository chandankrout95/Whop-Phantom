
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Order } from '@/lib/types';
import { useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';


const timeIntervals = [
    { value: '1', label: '1 min', subLabel: 'Test' },
    { value: '5', label: '5 min', subLabel: 'Fast' },
    { value: '8', label: '8 min', subLabel: 'Quick' },
    { value: '11', label: '11 min', subLabel: 'Default' },
    { value: '15', label: '15 min', subLabel: 'Safe' },
    { value: '20', label: '20 min', subLabel: 'Slow' },
    { value: '30', label: '30 min', subLabel: 'Very Safe' },
    { value: '60', label: '60 min', subLabel: 'Maximum' },
];

const editSchema = z.object({
  link: z.string().url('Please enter a valid video URL.'),
  quantity: z.coerce.number().min(1, 'Total views must be at least 1.'),
  quantityFrom: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  quantityTo: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  timeInterval: z.string(),
}).refine(data => data.quantityTo >= data.quantityFrom, {
    message: '"To" quantity must be greater than or equal to "From" quantity.',
    path: ['quantityTo'],
});


export function EditCampaignForm({
  campaign,
  onUpdate,
  onOpenChange,
}: {
  campaign: Order;
  onUpdate: (updatedCampaign: Order) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    if (campaign) {
      form.reset({
        link: campaign.link,
        quantity: campaign.quantity,
        quantityFrom: campaign.dripFeed?.quantityFrom,
        quantityTo: campaign.dripFeed?.quantityTo,
        timeInterval: campaign.dripFeed?.timeInterval,
      });
    }
  }, [campaign, form]);

  const onSubmit = (data: z.infer<typeof editSchema>) => {
    if (!campaign.dripFeed) return;

    const updatedCampaign: Order = {
      ...campaign,
      link: data.link,
      quantity: data.quantity,
      dripFeed: {
        ...campaign.dripFeed,
        quantityFrom: data.quantityFrom,
        quantityTo: data.quantityTo,
        timeInterval: data.timeInterval,
      },
    };
    onUpdate(updatedCampaign);
  };

  return (
    <Dialog open={!!campaign} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-black text-foreground border-primary/50">
        <DialogHeader>
          <DialogTitle>Edit Campaign: {campaign.dripFeed?.campaignName}</DialogTitle>
          <DialogDescription>
            Make changes to your active campaign. Changes will apply to future orders.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Link</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantityFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qty From</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantityTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qty To</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="timeInterval"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>Time Interval</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                        {timeIntervals.map((interval) => (
                            <FormItem key={interval.value} className="flex items-center">
                            <FormControl>
                                <RadioGroupItem value={interval.value} className="sr-only" />
                            </FormControl>
                            <FormLabel className={cn(
                                "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 font-normal hover:bg-accent hover:text-accent-foreground w-full cursor-pointer",
                                field.value === interval.value && "border-primary",
                            )}>
                                <span className="font-bold text-lg">{interval.label}</span>
                                <span className="text-xs text-muted-foreground">{interval.subLabel}</span>
                            </FormLabel>
                            </FormItem>
                        ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <DialogFooter>
              <Button type="submit">Update Campaign</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
