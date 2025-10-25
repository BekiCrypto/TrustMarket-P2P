'use client';

import { useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase, useUsers } from '@/firebase';
import { getDisputeById } from '@/lib/data'; // Keep for mock chat/receipts
import { DisputeLayout } from '@/components/dispute/dispute-layout';
import { UserInfoCard } from '@/components/dispute/user-info-card';
import { ChatTranscript } from '@/components/dispute/chat-transcript';
import { EvidenceGallery } from '@/components/dispute/evidence-gallery';
import { AiAnalysisCard } from '@/components/dispute/ai-analysis-card';
import { type Dispute, type DisputeDocument, UserProfile } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

function DisputeDetailSkeleton() {
  return (
    <DisputeLayout
      caseDetails={
        <>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="grid gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="grid gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </CardContent>
          </Card>
        </>
      }
      evidence={
        <>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </>
      }
      arbitratorTools={
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      }
    />
  );
}

export default function DisputePage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();

  const disputeRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'disputes', id) : null),
    [firestore, id]
  );

  const { data: dispute, isLoading: isDisputeLoading, error: disputeError } = useDoc<DisputeDocument>(disputeRef);

  const userIds = useMemo(() => {
    if (!dispute) return [];
    return [dispute.buyerId, dispute.sellerId].filter(Boolean);
  }, [dispute]);

  const { users, isLoading: areUsersLoading, error: usersError } = useUsers(userIds);

  // Still need mock data for chat and receipts
  const staticData = getDisputeById(id);

  const isLoading = isDisputeLoading || (dispute && areUsersLoading);
  const error = disputeError || usersError;

  if (isLoading) {
    return <DisputeDetailSkeleton />;
  }

  if (error) {
    return <div className="text-destructive-foreground bg-destructive/80 p-4 rounded-md">Error loading dispute: {error.message}</div>;
  }
  
  if (!dispute || !staticData) {
    notFound();
  }

  const buyer = users[dispute.buyerId];
  const seller = users[dispute.sellerId];

  if (!buyer || !seller) {
    // If users aren't loaded yet but dispute is, show skeleton.
    // This state is hit briefly between dispute load and user load.
    return <DisputeDetailSkeleton />;
  }

  const finalDisputeData: Dispute = {
    ...dispute,
    id,
    buyer,
    seller,
    chatTranscript: staticData.chatTranscript, // Use mock chat for now
    receiptIds: staticData.receiptIds, // Use mock receipts for now
    dateInitiated: staticData.dateInitiated,
  };

  return (
    <DisputeLayout
      caseDetails={
        <>
          <UserInfoCard user={finalDisputeData.buyer} role="Buyer" />
          <UserInfoCard user={finalDisputeData.seller} role="Seller" />
        </>
      }
      evidence={
        <>
          <ChatTranscript
            messages={finalDisputeData.chatTranscript}
            buyerId={finalDisputeData.buyer.id}
            sellerId={finalDisputeData.seller.id}
          />
          <EvidenceGallery receiptIds={finalDisputeData.receiptIds} />
        </>
      }
      arbitratorTools={<AiAnalysisCard dispute={finalDisputeData} />}
    />
  );
}
