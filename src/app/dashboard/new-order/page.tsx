
'use client';
import { NewOrderForm } from '@/components/dashboard/new-order-form';


export default function NewOrderPage() {
  return (
    <div className="flex flex-col gap-8">
       <h1 className="text-3xl font-bold tracking-tight">New Order</h1>
       <NewOrderForm />
    </div>
  );
}
