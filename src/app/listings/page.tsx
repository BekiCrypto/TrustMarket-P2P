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
import { useCollection, useFirestore, useMemoFirebase, useUsers } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { type ListingDocument, type UserProfile } from '@/types';

type ListingOverview = ListingDocument & { id: string };

const getStatusBadge = (status: ListingOverview['status']) => {
  switch (status) {
    case 'Active':
      return <Badge variant="default">Active</Badge>;
    case 'Sold':
      return <Badge variant="secondary">Sold</Badge>;
    case 'Suspended':
      return <Badge variant="destructive">Suspended</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const renderLoadingState = () => (
  <div className="mt-4 rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Listing</TableHead>
          <TableHead>Seller</TableHead>
          <TableHead className="hidden md:table-cell">Price</TableHead>
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
              <div className="space-y-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-5 w-16" />
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

export default function ListingsPage() {
    const firestore = useFirestore();
    const listingsQuery = useMemoFirebase(
        () =>
        firestore
            ? query(collection(firestore, 'listings'), orderBy('title'))
            : null,
        [firestore]
    );

    const { data: listings, isLoading: listingsLoading, error: listingsError } = useCollection<ListingOverview>(listingsQuery);

    const sellerIds = useMemo(() => {
        if (!listings) return [];
        return Array.from(new Set(listings.map(l => l.sellerId)));
    }, [listings]);

    const { users: sellers, isLoading: sellersLoading, error: sellersError } = useUsers(sellerIds);
    
    const isLoading = listingsLoading || (listings && listings.length > 0 && sellersLoading);
    const error = listingsError || sellersError;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listings</CardTitle>
        <CardDescription>
          Manage and monitor all active and inactive listings on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="sold">Sold</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
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
                        <TableHead>Listing</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Price
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings?.map(listing => {
                        const seller = sellers[listing.sellerId];
                        const sellerAvatar = seller ? getImageById(seller.avatarId) : null;
                        
                        return (
                          <TableRow key={listing.id}>
                            <TableCell>
                              <div className="font-medium">{listing.title}</div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                ID: {listing.id}
                              </div>
                            </TableCell>
                            <TableCell>
                              {seller ? (
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    {sellerAvatar && (
                                      <AvatarImage
                                        src={sellerAvatar.imageUrl}
                                        alt={seller.name}
                                        data-ai-hint={sellerAvatar.imageHint}
                                      />
                                    )}
                                    <AvatarFallback>
                                      {seller.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{seller.name}</span>
                                </div>
                              ) : <Skeleton className="h-5 w-24" />}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              ${listing.price.toFixed(2)}
                            </TableCell>
                            <TableCell>{getStatusBadge(listing.status)}</TableCell>
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
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Suspend Listing</DropdownMenuItem>
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
