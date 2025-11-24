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
import { orders, services, panels } from "@/lib/data";

export function RecentOrders() {
  const recentOrders = orders.slice(0, 5);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "In Progress":
        return "secondary";
      case "Pending":
        return "outline";
      case "Canceled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>A list of your most recent orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead className="hidden md:table-cell">Panel</TableHead>
              <TableHead className="text-right">Charge</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => {
              const service = services.find((s) => s.id === order.serviceId);
              const panel = panels.find((p) => p.id === order.panelId);
              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{service?.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Qty: {order.quantity}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {panel?.name}
                  </TableCell>
                  <TableCell className="text-right">
                    ${order.charge.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
