"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getRoutingRecommendation } from "../actions";
import type { RouteOrderOutput } from "@/ai/flows/automated-order-routing";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Service, Panel } from "@/lib/types";
import { useCollection, useFirebase, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection, collectionGroup, query } from "firebase/firestore";

const orderFormSchema = z.object({
  category: z.string().min(1, "Please select a category."),
  service: z.string().min(1, "Please select a service."),
  link: z.string().url("Please enter a valid URL."),
  quantity: z.coerce
    .number()
    .min(1, "Quantity must be at least 1."),
  routingPreference: z.enum(["price", "deliveryTime"]),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export function OrderForm() {
  const [recommendation, setRecommendation] = useState<RouteOrderOutput & { panelId: string; serviceId: string; charge: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { firestore, user } = useFirebase();

  const servicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collectionGroup(firestore, 'services'));
  }, [firestore, user]);
  const { data: services, isLoading: servicesLoading } = useCollection<Service>(servicesQuery);

  const panelsRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'smm_panels');
  }, [firestore, user]);
  const { data: panels, isLoading: panelsLoading } = useCollection<Panel>(panelsRef);


  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      category: "",
      service: "",
      link: "",
      quantity: 1000,
      routingPreference: "price",
    },
  });

  const selectedCategory = form.watch("category");

  const uniqueCategories = useMemo(() => {
    if (!services) return [];
    return [...new Set(services.map((s) => s.category))];
  }, [services]);

  const availableServices = useMemo(() => {
    if (!services || !selectedCategory) return [];
    return services.filter((s) => s.category === selectedCategory);
  }, [services, selectedCategory]);
  
  const uniqueServiceNames = useMemo(() => {
      if (!availableServices) return [];
      return [...new Set(availableServices.map((s) => s.name))];
  }, [availableServices]);

  const handleFindPanel = async () => {
    setError(null);
    setRecommendation(null);
    const { service, quantity, routingPreference } = form.getValues();
    
    if (!service || !quantity) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a service and enter a quantity.",
      });
      return;
    }

    if (!services || !panels) {
        toast({
            variant: "destructive",
            title: "Data not loaded",
            description: "Services or panels data is not available yet.",
        });
        return;
    }

    setIsLoading(true);
    try {
      const result = await getRoutingRecommendation({
        serviceName: service,
        quantity: quantity,
        preference: routingPreference,
        services,
        panels
      });
      const bestPanel = panels.find(p => p.name === result.bestPanel);
      const bestService = services.find(s => s.smmPanelId === bestPanel?.id && s.name === service);
      if (!bestPanel || !bestService) throw new Error("Recommendation engine failed.")

      setRecommendation({
          ...result,
          panelId: bestPanel.id,
          serviceId: bestService.id,
          charge: (bestService.rate / 1000) * quantity
      });

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: OrderFormValues) => {
    if (!recommendation || !user || !firestore) return;

    const orderData = {
        userId: user.uid,
        serviceId: recommendation.serviceId,
        link: data.link,
        quantity: data.quantity,
        charge: recommendation.charge,
        status: 'Pending',
        panelId: recommendation.panelId,
        createdAt: new Date().toISOString(),
    };

    const ordersRef = collection(firestore, `users/${user.uid}/orders`);
    addDocumentNonBlocking(ordersRef, orderData);

    toast({
      title: "Order Placed!",
      description: `Your order for ${data.quantity} ${data.service} has been placed with ${recommendation?.bestPanel}.`,
    });
    form.reset();
    setRecommendation(null);
  };

  if(servicesLoading || panelsLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>
                  Select a service and provide the necessary details.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('service', '');
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {uniqueCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
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
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {uniqueServiceNames.map((serviceName) => (
                            <SelectItem key={serviceName} value={serviceName}>
                              {serviceName}
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
                  name="link"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
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
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
             <Card>
              <CardHeader>
                <CardTitle>Automated Routing</CardTitle>
                <CardDescription>
                  Let AI find the best panel for your order.
                </CardDescription>
              </Header>
              <CardContent>
                <FormField
                  control={form.control}
                  name="routingPreference"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Route by...</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="price" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Best Price
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="deliveryTime" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Fastest Delivery
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                 <Button type="button" onClick={handleFindPanel} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Find Best Panel
                  </Button>
              </CardFooter>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {recommendation && (
              <Card className="bg-primary/10 border-primary">
                <CardHeader>
                  <CardTitle className="text-primary">Recommendation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                   <p className="font-semibold">Best Panel: <span className="text-primary">{recommendation.bestPanel}</span></p>
                   <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={!recommendation}>
              Place Order
            </Button>
        </div>
      </form>
    </Form>
  );
}
