'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Gavel, LayoutDashboard, List, Settings, Users } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '../logo';
import { Header } from './header';

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'disputes', label: 'Disputes', icon: Gavel, href: '/disputes/1' },
    { id: 'listings', label: 'Listings', icon: List, href: '/listings' },
    { id: 'users', label: 'Users', icon: Users, href: '/users' },
  ];
  
  const settingsItem = { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' };


  return (
    <SidebarProvider>
      <div className="min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    href={item.href}
                    isActive={pathname === item.href || (item.id === 'disputes' && pathname.startsWith('/disputes'))}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={settingsItem.label} href={settingsItem.href} isActive={pathname === settingsItem.href}>
                  <Settings />
                  <span>{settingsItem.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
