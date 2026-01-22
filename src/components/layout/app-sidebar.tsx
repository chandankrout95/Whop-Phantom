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
import { useState } from 'react';
import { PinLockDialog } from '../pin-lock-dialog';


const navItems: NavItem[] = [
  { href: '/dashboard', title: 'Dashboard', icon: LayoutDashboard, locked: true },
  // { href: '/dashboard/new-order', title: 'New Order', icon: PlusCircle, locked: true },
  // { href: '/dashboard/orders', title: 'Orders', icon: ListOrdered, locked: true },
  // { href: '/dashboard/services', title: 'Services', icon: Package, locked: true },
  // { href: '/dashboard/panels', title: 'Panels', icon: Server, locked: true },
  { href: '/dashboard/whop-phantom', title: 'Whop Phantom', icon: Ghost, locked: false },
  { href: '/dashboard/delete-phantom', title: 'delete Phantom', icon: Ghost, locked: false },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { setOpen } = useSidebar();
  const router = useRouter();

  const [pinTarget, setPinTarget] = useState<string | null>(null);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  const isPinUnlocked = () => {
    try {
        return sessionStorage.getItem('pin-unlocked') === 'true';
    } catch(e) {
        return false;
    }
  }

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.locked && !isPinUnlocked()) {
      e.preventDefault();
      setPinTarget(item.href);
      setIsPinDialogOpen(true);
    }
  }

  const handlePinSuccess = () => {
    try {
        sessionStorage.setItem('pin-unlocked', 'true');
    } catch(e) {
        // ignore
    }
    if (pinTarget) {
      router.push(pinTarget);
    }
    setIsPinDialogOpen(false);
    setPinTarget(null);
  }


  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Zap className="w-8 h-8 text-primary" />
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
                <Link href={item.href} onClick={(e) => handleNavClick(e, item)}>
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
      <PinLockDialog 
        isOpen={isPinDialogOpen}
        onOpenChange={setIsPinDialogOpen}
        onSuccess={handlePinSuccess}
      />
    </>
  );
}
