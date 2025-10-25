
'use client';

import { CircleUser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '../ui/sidebar';
import { Breadcrumb } from '../breadcrumb';
import Image from 'next/image';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export function Header() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getBreadcrumbItems = () => {
    const pathParts = pathname.split('/').filter(part => part);
    const items = [{ label: 'Home', href: '/dashboard' }];

    if (pathParts.length === 0 || pathParts[0] === 'dashboard') {
        return [{ label: 'Dashboard', href: '/dashboard' }];
    }

    let currentPath = '';
    pathParts.forEach((part, index) => {
        currentPath += `/${part}`;
        const isLast = index === pathParts.length - 1;
        
        let label = part.charAt(0).toUpperCase() + part.slice(1);
        if (part.match(/^\d+$/)) {
            label = `Case #${part}`;
        }

        if (index === 0) {
            items[0] = { label, href: currentPath };
        } else {
            items.push({ label, href: isLast ? undefined : currentPath });
        }
    });

    return items;
  };


  const userAvatarUrl = user?.photoURL;
  const userDisplayName = user?.displayName || 'Arbitrator';
  const userEmail = user?.email || 'No email';

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="flex md:hidden" />
      <div className="w-full flex-1">
        <Breadcrumb items={getBreadcrumbItems()} />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            {userAvatarUrl ? (
              <Image
                src={userAvatarUrl}
                alt="User Avatar"
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            ) : (
              <CircleUser className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="font-medium">{userDisplayName}</div>
            <div className="text-xs text-muted-foreground">{userEmail}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
