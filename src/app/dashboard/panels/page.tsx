'use client';
import { useState } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Panel } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockPanels } from '@/lib/mock-data';


export default function PanelsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [panels, setPanels] = useState<Panel[]>(mockPanels);
  const [newPanel, setNewPanel] = useState({ name: '', apiUrl: '', apiKey: ''});

  const handleAddPanel = () => {
    if (!newPanel.name || !newPanel.apiUrl || !newPanel.apiKey) return;
    
    const panelData: Panel = {
      ...newPanel,
      id: `panel-${panels.length + 1}`,
      balance: Math.floor(Math.random() * 500)
    };

    setPanels(prev => [...prev, panelData]);
    setNewPanel({ name: '', apiUrl: '', apiKey: ''});
    setIsDialogOpen(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Panels</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Panel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Panel</DialogTitle>
              <DialogDescription>
                Connect a new SMM panel by providing its details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={newPanel.name} onChange={(e) => setNewPanel({...newPanel, name: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="apiUrl" className="text-right">
                  API URL
                </Label>
                <Input id="apiUrl" value={newPanel.apiUrl} onChange={(e) => setNewPanel({...newPanel, apiUrl: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="apiKey" className="text-right">
                  API Key
                </Label>
                <Input id="apiKey" value={newPanel.apiKey} onChange={(e) => setNewPanel({...newPanel, apiKey: e.target.value})} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddPanel}>Save panel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Panels</CardTitle>
          <CardDescription>
            Manage your connected SMM panel APIs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Panel Name</TableHead>
                <TableHead>API Status</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {panels?.map((panel) => (
                <TableRow key={panel.id}>
                  <TableCell className="font-medium">{panel.name}</TableCell>
                  <TableCell>
                    <Badge>Connected</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${panel.balance.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
