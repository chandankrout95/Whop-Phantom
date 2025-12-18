
'use client';

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import type { Service } from '@/lib/types';
import { mockServices, mockPanels } from '@/lib/mock-data';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

export default function ServicesPage() {
  const allServices = mockServices;
  const panels = mockPanels;
  const [chosenServices, setChosenServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

  const handleSelectService = (serviceId: string, isSelected: boolean) => {
    setSelectedServices(prev => {
      const newSelection = new Set(prev);
      if (isSelected) {
        newSelection.add(serviceId);
      } else {
        newSelection.delete(serviceId);
      }
      return newSelection;
    });
  };

  const handleAddServices = () => {
    const servicesToAdd = allServices.filter(s => selectedServices.has(s.id));
    
    // Prevent duplicates
    const servicesToActuallyAdd = servicesToAdd.filter(
      (serviceToAdd) => !chosenServices.some((cs) => cs.id === serviceToAdd.id)
    );

    setChosenServices(prev => [...prev, ...servicesToActuallyAdd]);
    setSelectedServices(new Set());
    setIsDialogOpen(false);
  };

  const handleRemoveService = (serviceId: string) => {
    setChosenServices(prev => prev.filter(s => s.id !== serviceId));
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Services</DialogTitle>
              <DialogDescription>
                Select services to add to your curated list.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Panel</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allServices.map(service => {
                    const panel = panels.find(p => p.id === service.smmPanelId);
                    return (
                      <TableRow key={service.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedServices.has(service.id)}
                            onCheckedChange={(checked) => handleSelectService(service.id, !!checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-xs text-muted-foreground">{service.category}</div>
                        </TableCell>
                        <TableCell>{panel?.name}</TableCell>
                        <TableCell className="text-right">${service.rate.toFixed(3)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddServices}>Add Selected</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Your Chosen Services</CardTitle>
          <CardDescription>
            A curated list of your most-used services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chosenServices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Panel</TableHead>
                  <TableHead className="text-right">Rate / 1k</TableHead>
                  <TableHead className="text-right">Min / Max</TableHead>
                  <TableHead className="w-20 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chosenServices.map((service) => {
                  const panel = panels.find((p) => p.id === service.smmPanelId);
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
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveService(service.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
              <p className="text-lg font-semibold text-foreground">No Services Chosen</p>
              <p className="text-sm text-muted-foreground">Click "Add New Service" to start building your list.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
