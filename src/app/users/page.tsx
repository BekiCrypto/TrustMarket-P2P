
'use client';

import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ListFilter, CheckCircle, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getImageById } from '@/lib/placeholder-images';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { type UserProfile, type UserKycStatus } from '@/types';
import { updateUserKycStatus } from '@/app/actions/user';
import { useToast } from '@/hooks/use-toast';

const getKycBadge = (status: UserKycStatus) => {
  switch (status) {
    case 'Verified':
      return <Badge className="bg-green-500 text-white">Verified</Badge>;
    case 'Pending':
      return <Badge className="bg-yellow-500 text-black">Pending</Badge>;
    case 'Unverified':
      return <Badge variant="secondary">Unverified</Badge>;
    case 'Rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const renderLoadingState = () => (
    <div className="mt-4 rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Reputation</TableHead>
                    <TableHead className="hidden md:table-cell">Trades</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="grid gap-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell>
                           <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
);


export default function UsersPage() {
  const firestore = useFirestore();
  const [updatingKyc, setUpdatingKyc] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const usersQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'users'), orderBy('name')) : null),
    [firestore]
  );

  const { data: users, isLoading, error } = useCollection<UserProfile>(usersQuery);

  const handleKycUpdate = async (userId: string, status: UserKycStatus) => {
    setUpdatingKyc(prev => ({...prev, [userId]: true}));
    const response = await updateUserKycStatus({ userId, status });
    setUpdatingKyc(prev => ({...prev, [userId]: false}));
    if (response.success) {
      toast({
        title: 'KYC Status Updated',
        description: `User's KYC status has been set to ${status}.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: response.error,
      });
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          View, manage, and monitor all user accounts on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="unverified">Unverified</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  {/* Add filter items here */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <TabsContent value="all">
            {isLoading
              ? renderLoadingState()
              : error
              ? <div className="text-destructive-foreground bg-destructive/80 p-4 rounded-md mt-4">Error: {error.message}</div>
              : (
                <div className="mt-4 rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Reputation</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Trades
                        </TableHead>
                        <TableHead>KYC Status</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map(user => {
                        const userAvatar = getImageById(user.avatarId);
                        const isUpdating = updatingKyc[user.id];
                        return (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  {userAvatar && (
                                    <AvatarImage
                                      src={userAvatar.imageUrl}
                                      alt={user.name}
                                      data-ai-hint={userAvatar.imageHint}
                                    />
                                  )}
                                  <AvatarFallback>
                                    {user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="grid gap-0.5">
                                  <div className="font-medium">{user.name}</div>
                                  <div className="hidden text-sm text-muted-foreground md:inline">
                                    {user.email || 'No email provided'}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.reputation}%</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {user.trades}
                            </TableCell>
                            <TableCell>{getKycBadge(user.kycStatus)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                    disabled={isUpdating}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                                  <DropdownMenuItem>View Disputes</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuLabel>KYC Management</DropdownMenuLabel>
                                  <DropdownMenuItem 
                                    disabled={isUpdating || user.kycStatus === 'Verified'}
                                    onClick={() => handleKycUpdate(user.id, 'Verified')}
                                    className="text-green-600 focus:bg-green-50 focus:text-green-700"
                                  >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve KYC
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    disabled={isUpdating || user.kycStatus === 'Rejected'}
                                    onClick={() => handleKycUpdate(user.id, 'Rejected')}
                                    className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject KYC
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-700">
                                    Suspend User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
