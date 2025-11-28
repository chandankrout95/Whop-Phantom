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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Terminal } from 'lucide-react';
import { toast } from '@/hooks/use-toast';


const phantomFormSchema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required.'),
  videoLink: z.string().url('Please enter a valid video URL.'),
  totalViews: z.coerce.number().min(1, 'Total views must be at least 1.'),
  variant: z.enum(['standard', 'hq', 'premium'], {
    required_error: 'You need to select a variant.',
  }),
  quantityFrom: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  quantityTo: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  timeInterval: z.coerce.number().min(1, 'Time interval must be at least 1.'),
}).refine(data => data.quantityTo >= data.quantityFrom, {
    message: '"To" quantity must be greater than or equal to "From" quantity.',
    path: ['quantityTo'],
});

type PhantomFormValues = z.infer<typeof phantomFormSchema>;

export function WhopPhantomForm() {
  const form = useForm<PhantomFormValues>({
    resolver: zodResolver(phantomFormSchema),
    defaultValues: {
      campaignName: '',
      videoLink: '',
    },
  });

  const onSubmit = (data: PhantomFormValues) => {
    console.log('Botting task started:', data);
    toast({
        title: "Task Initiated",
        description: `Botting campaign "${data.campaignName}" has started.`,
    });
    form.reset();
  };

  return (
    <div className="w-full max-w-lg rounded-lg border border-green-700/50 bg-black/50 p-3 shadow-[0_0_20px_rgba(0,255,0,0.2)] backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-green-700/50 pb-2 mb-4">
            <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <h1 className="text-lg text-primary">PHANTOM_CONTROLS</h1>
            </div>
        </div>
        <div className="p-4">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="campaignName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Campaign Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Viral Video Push" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="videoLink"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Video Link</FormLabel>
                        <FormControl>
                            <Input type="url" placeholder="https://youtube.com/watch?v=..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="totalViews"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Total Views</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="1000000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="variant"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Variants</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="standard" />
                                </FormControl>
                                <FormLabel className="font-normal">Standard</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="hq" />
                                </FormControl>
                                <FormLabel className="font-normal">HQ</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="premium" />
                                </FormControl>
                                <FormLabel className="font-normal">Premium</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="quantityFrom"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Qty From</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="100" {...field} />
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
                                <Input type="number" placeholder="500" {...field} />
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
                        <FormItem>
                        <FormLabel>Time Interval (minutes)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="60" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full !mt-6">
                    Start Botting
                </Button>
            </form>
            </Form>
        </div>
    </div>
  );
}
