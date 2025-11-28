'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthProvider } from '@/hooks/use-auth';
import { NewOrderForm } from '@/components/dashboard/new-order-form';

function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="flex items-center gap-4">
                <SidebarTrigger />
                <NewOrderForm />
            </div>
            <div className="flex-1 text-center">
                <h1 className="text-xl font-bold tracking-tight text-primary animate-flicker-glitch" style={{ textShadow: '0 0 10px hsl(var(--primary))' }}>
                    Whop Phantom
                </h1>
            </div>
            {/* Empty div to balance the SidebarTrigger and center the title */}
            <div className="w-7" />
        </header>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardRootLayout>{children}</DashboardRootLayout>
    </AuthProvider>
  );
}
