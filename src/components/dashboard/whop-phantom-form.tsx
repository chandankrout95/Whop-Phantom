
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { Order, Service } from '@/lib/types';
import { getSmmServices, placeSmmOrder } from '@/app/dashboard/actions';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { useNewOrder } from '@/context/new-order-context';
import { PinLockDialog } from '../pin-lock-dialog';
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { addCampaign } from "@/store/campaignSlice";
import { matchPanelServices } from '@/lib/match-services';




const phantomFormSchema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required.'),
  videoLink: z.string().url('Please enter a valid video URL.'),
  serviceId: z.string().min(1, "Please select a service."),
  version: z.string(), // This is now a shortcut selector, validation can be optional
  totalViews: z.coerce.number().min(1, 'Total views must be at least 1.'),
  variant: z.enum(['standard', 'hq', 'premium'], {
    required_error: 'You need to select a variant.',
  }),
  quantityFrom: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  quantityTo: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  timeInterval: z.string({
    required_error: "Please select a time interval.",
  }),
}).refine(data => data.quantityTo >= data.quantityFrom, {
  message: '"To" quantity must be greater than or equal to "From" quantity.',
  path: ['quantityTo'],
});

type PhantomFormValues = z.infer<typeof phantomFormSchema>;

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

// const versionShortcuts = [
//   { value: '13426', label: 'VIEWS + REELS [PLAYS + REACH]' },
//   { value: '13369', label: 'VIEWS + REELS [AD VIEWS - GLOBAL]' },
//   { value: '13368', label: 'VIEWS + REELS [INDIA- GLOBAL]' },
// ]
// const ALLOWED_SERVICE_KEYWORDS = [
//   'VIEWS + REELS [PLAYS + REACH]',
//   'VIEWS + REELS [AD VIEWS - GLOBAL]',
//   'VIEWS + REELS [INDIA- GLOBAL]',
// ];
// const SERVICE_MATCHERS = [
//   ['views', 'reels', 'reach'],
//   ['views', 'reels', 'ad'],
//   ['views', 'reels', 'india'],
// ];




export function WhopPhantomForm({
  setCampaigns,
}: {
  setCampaigns: React.Dispatch<React.SetStateAction<Order[]>>;
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [mainServices, setMainServices] = useState<Service[]>([]);
  const { platform } = useNewOrder();
  const [searchTerm, setSearchTerm] = useState('');
  const [showServices, setShowServices] = useState(false);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [mappedServices, setMappedServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);


  useEffect(() => {
    async function load() {
      const all = await getSmmServices();
      const mapped = matchPanelServices(all);
      // console.log(mapped);
      setMappedServices(mapped);
    }
    load();
  }, []);
  const uniqueServices = useMemo(() => {
    return Array.from(
      new Map(mappedServices.map(s => [s.serviceId, s])).values()
    );
  }, [mappedServices]);
  
  
  
  
  
  

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedServices = await getSmmServices();

        setAllServices(fetchedServices);
      } catch (error) {
        toast({
          title: "Error fetching services",
          description: "Could not load the list of services from the SMM panel.",
          variant: "destructive",
        });
      }
    };
    fetchServices();
  }, [toast]);

  useEffect(() => {
    try {
      const savedServices = localStorage.getItem('chosenServices');
      if (savedServices) {
        setMainServices(JSON.parse(savedServices));
      }
    } catch (error) {
      console.error("Could not read chosen services from localStorage", error);
    }
  }, []);

  const filteredServices = useMemo(() => {
    let servicesByPlatform = allServices;
    if (platform !== 'all' && platform) {
      servicesByPlatform = allServices.filter(service =>
        (service.category?.toLowerCase() || '').includes(platform.toLowerCase())
      );
    }

    // Exclude main services from the "all" list
    const mainServiceIds = new Set(mainServices.map(s => s.id));
    let allFiltered = servicesByPlatform.filter(s => !mainServiceIds.has(s.service.toString()));


    if (!searchTerm) {
      return allFiltered;
    }

    return allFiltered.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  }, [allServices, mainServices, platform, searchTerm]);


  const form = useForm<PhantomFormValues>({
    resolver: zodResolver(phantomFormSchema),
    defaultValues: {
      campaignName: '',
      videoLink: '',
      serviceId: '',
      version: '',
      totalViews: 1000,
      variant: 'standard',
      quantityFrom: 100,
      quantityTo: 150,
      timeInterval: "11",
    },
  });

  const onSubmit = async (data: z.infer<typeof phantomFormSchema>) => {
    setIsSubmitting(true);
    // console.log(data.serviceId)
    // console.log(allServices)
   


    try {
      if (!selectedService) {
        throw new Error("No service selected");
      }
      
      if (data.quantityFrom < selectedService.min) {
        throw new Error(
          `Minimum quantity for this service is ${selectedService.min}`
        );
      }
      
      if (data.quantityFrom > selectedService.max) {
        throw new Error(
          `Maximum quantity for this service is ${selectedService.max}`
        );
      }
      
      const normalizedTarget = String(data.serviceId).trim();

      const exists = allServices.some(s => {
        const serviceId =
          s.service ??
          s.id ??
          s.service_id;
  
        if (!serviceId) return false;
  
        return String(serviceId).trim() === normalizedTarget;
      });
  
      if (!exists) {
        throw new Error(
          `Service ID ${normalizedTarget} not found for this API key`
        );
      }
      // 1. Send first order to SMM Panel immediately
      const result = await placeSmmOrder({
        link: data.videoLink,
        quantity: data.quantityFrom,
        serviceId: data.serviceId,
      });

      if (!result.success) throw new Error(result.error);

      // 2. Create the Campaign object for the dashboard
      const newCampaign: Order = {
        id: `C-${Date.now()}`,
        link: data.videoLink,
        serviceId: data.serviceId, // Keep as string
        quantity: data.totalViews,
        status: "In Progress",
        createdAt: new Date().toISOString(),
        charge: 0,
        panelId: "smmsocialmedia",
        userId: "user-1",
        dripFeed: {
          campaignName: data.campaignName,
          totalOrdered: data.quantityFrom,
          quantityFrom: data.quantityFrom,
          quantityTo: data.quantityTo,
          timeInterval: data.timeInterval, // Store for the interval processor
          nextRun: Date.now() + (parseInt(data.timeInterval) * 60000),
          runs: 1,
        },
      };

      dispatch(addCampaign(newCampaign));

      setCampaigns((prev: any) => [newCampaign, ...prev]);
      toast({ title: "Campaign Started", description: `Order #${result.orderId} placed.` });
      form.reset();
    } catch (err: any) {
      toast({ title: "Order Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };




  const handlePinSuccess = () => {
    setShowServices(true);
    setIsPinDialogOpen(false);
  }

  return (
    <>
      <div className="w-full h-full overflow-y-auto rounded-lg border border-green-700/50 bg-black/50 p-3 shadow-[0_0_20px_rgba(0,255,0,0.2)] backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-green-700/50 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <h1 className="text-lg text-primary">
              PHANTOM_CONTROLS
            </h1>
          </div>
        </div>
        <div className="p-4">
          <Form {...form}>
            <form onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }}
              className="space-y-4">
              <FormField
                control={form.control}
                name="campaignName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Viral Video Push" {...field} disabled={isSubmitting} />
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
                      <Input type="url" placeholder="https://youtube.com/watch?v=..." {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="button" onClick={() => setIsPinDialogOpen(true)}>yoyo</Button>

              {showServices && (
                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);

                          const exists = allServices.some(s =>
                            String(s.service).trim() === String(value).trim()
                          );

                          if (!exists) {
                            toast({
                              title: "Service not available",
                              description: "This version is not enabled for your API key",
                              variant: "destructive",
                            });
                            return;
                          }

                          form.setValue('serviceId', value);
                        }}
                        value={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={allServices.length > 0 ? "Select a service..." : "Loading services..."} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div className="p-2">
                            <Input
                              placeholder="Search services..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full"
                            />
                          </div>
                          <ScrollArea className="h-72">
                            {mainServices.length > 0 && (
                              <SelectGroup>
                                <SelectLabel>Main Services</SelectLabel>
                                {mainServices.map((service) => (
                                  <SelectItem key={service.id} value={service.id.toString()}>
                                    {service.name} (${service.rate}/1k)
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            )}
                            {mainServices.length > 0 && <SelectSeparator />}
                            <SelectGroup>
                              <SelectLabel>All Services</SelectLabel>
                              {filteredServices.map((service) => (
                                <SelectItem key={service.service} value={service.service.toString()}>
                                  {service.name} (${service.rate}/1k)
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
<FormField
  control={form.control}
  name="serviceId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Service</FormLabel>

      <Select
  value={field.value}
  onValueChange={(value) => {
    const service = allServices.find(
      s => String(s.service) === String(value)
    );

    if (!service) {
      toast({
        title: "Invalid service",
        description: "Service not available for this API key",
        variant: "destructive",
      });
      return;
    }

    setSelectedService(service);

    // auto-fix quantity
    form.setValue("quantityFrom", service.min);
    form.setValue("quantityTo", service.min);

    field.onChange(value);
  }}
>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select service" />
          </SelectTrigger>
        </FormControl>

        <SelectContent>
          {uniqueServices.map((service) => (
            <SelectItem
              key={service.serviceId}   // ✅ UNIQUE & STABLE
              value={service.serviceId}
            >
              {service.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <FormMessage />
    </FormItem>
  )}
/>


              <FormField
                control={form.control}
                name="totalViews"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1000000" {...field} disabled={isSubmitting} />
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
                            <RadioGroupItem value="standard" disabled={isSubmitting} />
                          </FormControl>
                          <FormLabel className="font-normal">Standard</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="hq" disabled={isSubmitting} />
                          </FormControl>
                          <FormLabel className="font-normal">HQ</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="premium" disabled={isSubmitting} />
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
                        <Input type="number" placeholder="100" {...field} disabled={isSubmitting} />
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
                        <Input type="number" placeholder="500" {...field} disabled={isSubmitting} />
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
                              <RadioGroupItem value={interval.value} className="sr-only" disabled={isSubmitting} />
                            </FormControl>
                            <FormLabel className={cn(
                              "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 font-normal hover:bg-accent hover:text-accent-foreground w-full cursor-pointer",
                              field.value === interval.value && "border-primary",
                              isSubmitting && "cursor-not-allowed opacity-50"
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


              <Button type="button"
                onClick={() => form.handleSubmit(onSubmit)()}
                className="w-full !mt-8 text-lg" size="lg" disabled={isSubmitting || allServices.length === 0}>
                {isSubmitting ? 'Submitting...' : 'Create Campaign'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <PinLockDialog
        isOpen={isPinDialogOpen}
        onOpenChange={setIsPinDialogOpen}
        onSuccess={handlePinSuccess}
        correctPin="579"
      />
    </>
  );
}




