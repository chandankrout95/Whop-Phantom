'use client';
import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Service, Panel } from '@/lib/types';
import { useCollection, useFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function ServicesPage() {
  const { firestore } = useFirebase();

  const servicesRef = useMemo(() => collection(firestore, 'smm_panels/panel-1/services'), [firestore]);
  const { data: services, isLoading: servicesLoading } = useCollection<Service>(servicesRef);

  const panelsRef = useMemo(() => collection(firestore, 'smm_panels'), [firestore]);
  const { data: panels, isLoading: panelsLoading } = useCollection<Panel>(panelsRef);

  const isLoading = servicesLoading || panelsLoading;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Services</h1>

      <Card>
        <CardHeader>
          <CardTitle>Service List</CardTitle>
          <CardDescription>
            All available services from your connected panels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Panel</TableHead>
                  <TableHead className="text-right">Rate / 1k</TableHead>
                  <TableHead className="text-right">Min / Max</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services?.map((service) => {
                  const panel = panels?.find((p) => p.id === service.smmPanelId);
                  return (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.category}</TableCell>
                      <TableCell>{panel?.name}</TableCell>
                      <TableCell className="text-right">
                        ${service.rate.toFixed(3)}
                      </TableCell>
                      <TableCell className="text-right">
                        {service.min} / {service.max.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
