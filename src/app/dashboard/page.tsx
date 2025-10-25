import {
  Activity,
  ArrowUpRight,
  Clock,
  Gavel,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';

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
import {
  getRecentDisputes,
  getStats,
  type RecentDispute,
} from '@/lib/dashboard-data';
import { getImageById } from '@/lib/placeholder-images';
import { DisputeVolumeChart } from '@/components/dashboard/dispute-volume-chart';

export default function DashboardPage() {
  const stats = getStats();
  const recentDisputes = getRecentDisputes();

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

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDisputes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalDisputesGrowth}% from last month
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
            <div className="text-2xl font-bold">{stats.resolvedDisputes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.resolvedDisputesGrowth}% from last month
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
            <div className="text-2xl font-bold">{stats.avgResolutionTime}</div>
            <p className="text-xs text-muted-foreground">
              {stats.avgResolutionTimeGrowth > 0 ? '+' : ''}
              {stats.avgResolutionTimeGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsersGrowth}% from last month
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDisputes.map(dispute => {
                  const avatar = getImageById(dispute.user.avatarId);
                  return (
                    <TableRow key={dispute.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {avatar && (
                              <AvatarImage
                                src={avatar.imageUrl}
                                alt={dispute.user.name}
                                data-ai-hint={avatar.imageHint}
                              />
                            )}
                            <AvatarFallback>
                              {dispute.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-0.5">
                            <div className="font-medium">
                              {dispute.user.name}
                            </div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              vs. {dispute.opponentName}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
