import { Gavel, CircleUser } from 'lucide-react';
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
import { getImageById } from '@/lib/placeholder-images';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { disputes } from '@/lib/data';

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
    const items = [{ label: 'Dashboard', href: '/dashboard' }];

    if (pathParts[0] === 'disputes') {
      items[0]!.label = 'Disputes';
      items[0]!.href = '/disputes';

      if (pathParts[1]) {
        const dispute = disputes.find(d => d.id === pathParts[1]);
        if (dispute) {
          items.push({ label: `Case #${dispute.id}` });
        }
      }
    } else if (pathParts.length > 0) {
      const pageName = pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1);
      items[0]!.label = pageName;
      items[0]!.href = `/${pathParts[0]}`;
    }

    return items;
  };


  const userAvatarUrl = user?.photoURL || getImageById('avatar-3')?.imageUrl;
  const userDisplayName = user?.displayName || 'Arbitrator';
  const userInitial = userDisplayName.charAt(0);

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
                data-ai-hint="person portrait"
              />
            ) : (
              <CircleUser className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{userDisplayName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
