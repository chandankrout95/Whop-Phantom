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
import { panels } from "@/lib/data";
import { PlusCircle } from "lucide-react";

export default function PanelsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Panels</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Panel
        </Button>
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
              {panels.map((panel) => (
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
