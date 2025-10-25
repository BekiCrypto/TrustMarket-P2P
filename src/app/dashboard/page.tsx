'use client';

import { useMemo } from 'react';
import {
  ArrowUpRight,
  Clock,
  Gavel,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import {
  collection,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { useCollection, useFirestore, useMemoFirebase, useUsers } from '@/firebase';
import { getImageById } from '@/lib/placeholder-images';
import { DisputeVolumeChart } from '@/components/dashboard/dispute-volume-chart';
import { type DisputeDocument, type UserProfile } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

type RecentDispute = DisputeDocument & { id: string };

const getStatusBadge = (status: RecentDispute['status']) => {
  switch (status) {
    case 'Open':
      return <Badge variant="destructive">Open</Badge>;
    case 'Resolved':
      return <Badge variant="secondary">Resolved</Badge>;
    case 'Pending':
      return <Badge className="bg-yellow-500 text-black">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function DashboardPage() {
  const firestore = useFirestore();

  const allDisputesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'disputes') : null),
    [firestore]
  );
  const resolvedDisputesQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'disputes'), where('status', '==', 'Resolved'))
        : null,
    [firestore]
  );
  const recentDisputesQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'disputes'), orderBy('id', 'desc'), limit(5))
        : null,
    [firestore]
  );
  const usersQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'users') : null),
    [firestore]
  );

  const { data: allDisputes, isLoading: loadingAllDisputes } =
    useCollection<DisputeDocument>(allDisputesQuery);
  const { data: resolvedDisputes, isLoading: loadingResolvedDisputes } =
    useCollection<DisputeDocument>(resolvedDisputesQuery);
  const { data: recentDisputes, isLoading: loadingRecentDisputes } =
    useCollection<RecentDispute>(recentDisputesQuery);
  const { data: allUsers, isLoading: loadingUsers } =
    useCollection<UserProfile>(usersQuery);

  const userIds = useMemo(() => {
    if (!recentDisputes) return [];
    const ids = new Set<string>();
    recentDisputes.forEach(d => {
      ids.add(d.buyerId);
      ids.add(d.sellerId);
    });
    return Array.from(ids);
  }, [recentDisputes]);

  const { users: recentDisputeUsers, isLoading: loadingRecentUsers } = useUsers(userIds);

  const stats = {
    totalDisputes: allDisputes?.length ?? 0,
    resolvedDisputes: resolvedDisputes?.length ?? 0,
    activeUsers: allUsers?.length ?? 0,
  };
  
  const isLoading = loadingAllDisputes || loadingResolvedDisputes || loadingRecentDisputes || loadingUsers;

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{stats.totalDisputes}</div>}
            <p className="text-xs text-muted-foreground">
              Live count of all cases
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Disputes Resolved
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{stats.resolvedDisputes}</div>}
            <p className="text-xs text-muted-foreground">
              Live count of resolved cases
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Resolution Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Calculation for this is more complex, leaving static for now */}
            <div className="text-2xl font-bold">48.3 hours</div>
            <p className="text-xs text-muted-foreground">
              Based on historical data
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{stats.activeUsers}</div>}
            <p className="text-xs text-muted-foreground">
              Total registered users
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Dispute Volume</CardTitle>
            <CardDescription>
              A summary of disputes created vs. resolved over the past 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <DisputeVolumeChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                A list of the most recent disputes needing attention.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/disputes">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingRecentDisputes ? (
               <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                     <div key={i} className="flex items-center gap-4">
                       <Skeleton className="h-9 w-9 rounded-full" />
                       <div className="space-y-2">
                         <Skeleton className="h-4 w-[150px]" />
                         <Skeleton className="h-3 w-[100px]" />
                       </div>
                       <Skeleton className="ml-auto h-6 w-16 rounded-full" />
                     </div>
                  ))}
               </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDisputes?.map(dispute => {
                  const buyer = recentDisputeUsers[dispute.buyerId];
                  const seller = recentDisputeUsers[dispute.sellerId];
                  const initiator = buyer; // Assume buyer initiated
                  const opponent = seller;
                  
                  if (!initiator || !opponent) return (
                    <TableRow key={dispute.id}>
                        <TableCell>
                             <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-3 w-[100px]" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                           <Skeleton className="h-6 w-16 rounded-full" />
                        </TableCell>
                    </TableRow>
                  );

                  const avatar = getImageById(initiator.avatarId);
                  return (
                    <TableRow key={dispute.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {avatar && (
                              <AvatarImage
                                src={avatar.imageUrl}
                                alt={initiator.name}
                                data-ai-hint={avatar.imageHint}
                              />
                            )}
                            <AvatarFallback>
                              {initiator.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-0.5">
                            <div className="font-medium">
                              {initiator.name}
                            </div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              vs. {opponent.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {getStatusBadge(dispute.status)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    