import { OrderForm } from "./order-form";

export default function NewOrderPage() {
  return (
    <div className="flex flex-col gap-8">
       <h1 className="text-3xl font-bold tracking-tight">New Order</h1>
       <OrderForm />
    </div>
  );
}
