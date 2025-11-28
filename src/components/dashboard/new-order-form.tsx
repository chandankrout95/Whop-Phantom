
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
} from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';


const formSchema = z.object({
  platform: z.enum(['youtube', 'tiktok', 'instagram', 'twitter-x']),
});

export function NewOrderForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Further actions will be implemented later
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md">
        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem className="flex flex-grow items-center gap-4 space-y-0">
                <FormLabel className="text-lg text-primary whitespace-nowrap">Platform:</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="ghost" size="icon">
            <ArrowRight className="h-6 w-6 text-primary" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
