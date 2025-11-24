'use client';
import { useMemo, useState } from 'react';
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
import { PlusCircle, Loader2 } from "lucide-react";
import { useCollection, addDocumentNonBlocking, useFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
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


export default function PanelsPage() {
  const { firestore } = useFirebase();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPanel, setNewPanel] = useState({ name: '', apiUrl: '', apiKey: ''});


  const panelsRef = useMemo(() => collection(firestore, 'smm_panels'), [firestore]);
  const { data: panels, isLoading: panelsLoading } = useCollection<Panel>(panelsRef);

  const handleAddPanel = () => {
    if (!newPanel.name || !newPanel.apiUrl || !newPanel.apiKey) return;
    
    const panelData = {
      ...newPanel,
      id: `panel-${(panels?.length || 0) + 2}`,
      balance: Math.floor(Math.random() * 500)
    }

    addDocumentNonBlocking(panelsRef, panelData);
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
          {panelsLoading ? (
             <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
