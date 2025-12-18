
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
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthProvider } from '@/hooks/use-auth';
import { NewOrderForm } from '@/components/dashboard/new-order-form';
import { NewOrderProvider } from '@/context/new-order-context';
import type { NavItem } from '@/lib/types';
import { PageLockOverlay } from '@/components/page-lock-overlay';
import { Ghost, LayoutDashboard, ListOrdered, Package, PlusCircle, Server } from 'lucide-react';


const navItems: NavItem[] = [
    { href: '/dashboard', title: 'Dashboard', icon: LayoutDashboard, locked: true },
    { href: '/dashboard/new-order', title: 'New Order', icon: PlusCircle, locked: true },
    { href: '/dashboard/orders', title: 'Orders', icon: ListOrdered, locked: true },
    { href: '/dashboard/services', title: 'Services', icon: Package, locked: true },
    { href: '/dashboard/panels', title: 'Panels', icon: Server, locked: true },
    { href: '/dashboard/whop-phantom', title: 'Whop Phantom', icon: Ghost, locked: false },
];

function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isPinUnlocked, setIsPinUnlocked] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

   useEffect(() => {
    try {
      setIsPinUnlocked(sessionStorage.getItem('pin-unlocked') === 'true');
    } catch (e) {
      setIsPinUnlocked(false);
    }
    // This is a bit of a hack to re-check when the pin dialog might have been used
    const interval = setInterval(() => {
        try {
            const unlocked = sessionStorage.getItem('pin-unlocked') === 'true';
            if (unlocked !== isPinUnlocked) {
                setIsPinUnlocked(unlocked);
            }
        } catch (e) {
            //
        }
    }, 500);
    return () => clearInterval(interval);
  }, [pathname, isPinUnlocked]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isPageLocked = navItems.find((item) => item.href === pathname)?.locked ?? false;
  const showLockOverlay = isPageLocked && !isPinUnlocked;

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
        <div className="relative p-4 sm:p-6 lg:p-8">
            <div className={showLockOverlay ? 'blur-md' : ''}>
                {children}
            </div>
            {showLockOverlay && <PageLockOverlay />}
        </div>
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
        <NewOrderProvider>
            <DashboardRootLayout>{children}</DashboardRootLayout>
        </NewOrderProvider>
    </AuthProvider>
  );
}
