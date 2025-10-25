'use client';

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
import type { DisputeOverview } from '@/lib/disputes-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getImageById } from '@/lib/placeholder-images';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { getUsers } from '@/lib/users-data';
import { Skeleton } from '@/components/ui/skeleton';

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
    isLoading,
    error,
  } = useCollection<DisputeOverview>(disputesQuery);

  const mockUsers = getUsers(); // We'll use this to find user details for now

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

  const renderDisputesTable = () => (
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
            // Find buyer and seller from mock data for now
            const buyer = mockUsers.find(u => u.id === dispute.buyerId);
            const seller = mockUsers.find(u => u.id === dispute.sellerId);

            if (!buyer || !seller) return null;

            const buyerAvatar = getImageById(buyer.avatarId);
            const sellerAvatar = getImageById(seller.avatarId);

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
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date().toLocaleDateString()}
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
              : renderDisputesTable()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
