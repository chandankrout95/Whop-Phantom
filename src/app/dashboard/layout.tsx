import { AppSidebar } from '@/components/layout/app-sidebar';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <Sidebar variant="sidebar" collapsible="icon">
            <AppSidebar />
        </Sidebar>
        <SidebarInset>
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
        </SidebarInset>
        <Toaster />
    </SidebarProvider>
  );
}
