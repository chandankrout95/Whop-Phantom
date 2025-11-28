
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const formSchema = z.object({
  platform: z.enum(['youtube', 'tiktok', 'instagram', 'twitter-x']).optional(),
});

export function NewOrderForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Card className="bg-black/50 border-green-700/50 shadow-[0_0_20px_rgba(0,255,0,0.2)] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">New Order</CardTitle>
        <CardDescription>Select a platform to begin.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a platform..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">Tiktok</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter-x">Twitter (X)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the social media platform for your order.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* The rest of the form will be built out in subsequent steps */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
