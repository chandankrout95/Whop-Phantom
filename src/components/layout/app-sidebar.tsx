'use client';

import {
  Ghost,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  PanelLeftClose,
  Package,
  PlusCircle,
  Server,
  Zap,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { NavItem } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

const navItems: NavItem[] = [
  { href: '/dashboard', title: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/new-order', title: 'New Order', icon: PlusCircle },
  { href: '/dashboard/orders', title: 'Orders', icon: ListOrdered },
  { href: '/dashboard/services', title: 'Services', icon: Package },
  { href: '/dashboard/panels', title: 'Panels', icon: Server },
  { href: '/dashboard/whop-phantom', title: 'Whop Phantom', icon: Ghost },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { setOpen } = useSidebar();
  const router = useRouter();

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };


  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Zap className="w-8 h-8 text-primary" />
          <span className="text-xl font-semibold">SMM Connector</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
           <SidebarMenuItem>
              <SidebarMenuButton tooltip="Close Navigation" onClick={() => setOpen(false)}>
                <PanelLeftClose />
                <span>Close Navigation</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
           <SidebarMenuItem>
              <SidebarMenuButton tooltip="Logout" onClick={handleSignOut}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Profile">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  {user?.photoURL && <AvatarImage src={user.photoURL} alt="User Avatar" />}
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{user?.displayName || user?.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
