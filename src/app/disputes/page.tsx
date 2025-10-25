'use client';

import { useMemo } from 'react';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ListFilter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getImageById } from '@/lib/placeholder-images';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase, useUsers } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { type DisputeDocument, type UserProfile } from '@/types';

type DisputeOverview = DisputeDocument & { id: string };

const getStatusBadge = (status: DisputeOverview['status']) => {
  switch (status) {
    case 'Open':
      return <Badge variant="destructive">Open</Badge>;
    case 'Resolved':
      return <Badge className="bg-green-500 text-white">Resolved</Badge>;
    case 'Pending':
      return <Badge className="bg-yellow-500 text-black">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const renderLoadingState = () => (
  <div className="mt-4 rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Case ID</TableHead>
          <TableHead>Participants</TableHead>
          <TableHead className="hidden md:table-cell">Date Initiated</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-5 w-16" />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-48" />
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-5 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-20 rounded-full" />
            </TableCell>
            <TableCell>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

function DisputesTable({ disputes, users, usersLoading }: { disputes: DisputeOverview[], users: Record<string, UserProfile>, usersLoading: boolean }) {
  if (usersLoading && disputes.length > 0) {
    // Special loading state for when disputes are loaded but users aren't yet
    return renderLoadingState();
  }

  return (
    <div className="mt-4 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Case ID</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead className="hidden md:table-cell">
              Date Initiated
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {disputes?.map(dispute => {
            const buyer = users[dispute.buyerId];
            const seller = users[dispute.sellerId];

            const buyerAvatar = buyer ? getImageById(buyer.avatarId) : null;
            const sellerAvatar = seller ? getImageById(seller.avatarId) : null;

            return (
              <TableRow key={dispute.id}>
                <TableCell>
                  <Link
                    href={`/disputes/${dispute.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    #{dispute.id}
                  </Link>
                </TableCell>
                <TableCell>
                  {buyer && seller ? (
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        <Avatar className="inline-block h-6 w-6 rounded-full border-2 border-background">
                          {buyerAvatar && (
                            <AvatarImage
                              src={buyerAvatar.imageUrl}
                              alt={buyer.name}
                            />
                          )}
                          <AvatarFallback>
                            {buyer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <Avatar className="inline-block h-6 w-6 rounded-full border-2 border-background">
                          {sellerAvatar && (
                            <AvatarImage
                              src={sellerAvatar.imageUrl}
                              alt={seller.name}
                            />
                          )}
                          <AvatarFallback>
                            {seller.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <span>
                        {buyer.name} vs {seller.name}
                      </span>
                    </div>
                  ) : (
                    <Skeleton className="h-5 w-48" />
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {dispute.dateInitiated ? new Date(dispute.dateInitiated).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/disputes/${dispute.id}`}>
                          Review Case
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Assign to Arbitrator
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
  );
}

export default function AllDisputesPage() {
  const firestore = useFirestore();
  const disputesQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'disputes'), orderBy('id', 'desc'))
        : null,
    [firestore]
  );

  const {
    data: disputes,
    isLoading: disputesLoading,
    error: disputesError,
  } = useCollection<DisputeOverview>(disputesQuery);

  const userIds = useMemo(() => {
    if (!disputes) return [];
    const ids = new Set<string>();
    disputes.forEach(d => {
      ids.add(d.buyerId);
      ids.add(d.sellerId);
    });
    return Array.from(ids);
  }, [disputes]);

  const { users, isLoading: usersLoading, error: usersError } = useUsers(userIds);

  const isLoading = disputesLoading || (disputes && disputes.length > 0 && usersLoading);
  const error = disputesError || usersError;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disputes</CardTitle>
        <CardDescription>
          Manage and review all ongoing and past disputes on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
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
              : <DisputesTable disputes={disputes || []} users={users} usersLoading={usersLoading} />
            }
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
