'use client';

import {
  LayoutDashboard,
  ListOrdered,
  Package,
  PlusCircle,
  Server,
  Zap,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { NavItem } from '@/lib/types';
import Link from 'next/link';

const navItems: NavItem[] = [
  { href: '/dashboard', title: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/new-order', title: 'New Order', icon: PlusCircle },
  { href: '/dashboard/orders', title: 'Orders', icon: ListOrdered },
  { href: '/dashboard/services', title: 'Services', icon: Package },
  { href: '/dashboard/panels', title: 'Panels', icon: Server },
];

export function AppSidebar() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

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
                href={item.href}
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
            <SidebarMenuButton tooltip="Profile">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span>User Name</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
