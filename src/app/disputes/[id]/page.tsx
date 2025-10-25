
'use client';

import { useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { doc, collection } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase, useUsers, useCollection } from '@/firebase';
import { DisputeLayout } from '@/components/dispute/dispute-layout';
import { UserInfoCard } from '@/components/dispute/user-info-card';
import { ChatTranscript } from '@/components/dispute/chat-transcript';
import { EvidenceGallery } from '@/components/dispute/evidence-gallery';
import { AiAnalysisCard } from '@/components/dispute/ai-analysis-card';
import { type Dispute, type DisputeDocument, type ChatMessage, type Evidence, type UserProfile } from '@/types';
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
  const chatRef = useMemoFirebase(
    () => (firestore && id ? collection(firestore, `disputes/${id}/chat`) : null),
    [firestore, id]
  );
  const evidenceRef = useMemoFirebase(
    () => (firestore && id ? collection(firestore, `disputes/${id}/evidence`) : null),
    [firestore, id]
  );

  const { data: disputeDoc, isLoading: isDisputeLoading, error: disputeError } = useDoc<DisputeDocument>(disputeRef);
  const { data: chatMessages, isLoading: isChatLoading, error: chatError } = useCollection<ChatMessage>(chatRef);
  const { data: evidence, isLoading: isEvidenceLoading, error: evidenceError } = useCollection<Evidence>(evidenceRef);


  const userIds = useMemo(() => {
    if (!disputeDoc) return [];
    return [disputeDoc.buyerId, disputeDoc.sellerId].filter(Boolean);
  }, [disputeDoc]);

  const { users, isLoading: areUsersLoading, error: usersError } = useUsers(userIds);

  const isLoading = isDisputeLoading || isChatLoading || isEvidenceLoading || (disputeDoc && areUsersLoading);
  const error = disputeError || usersError || chatError || evidenceError;

  if (isLoading) {
    return <DisputeDetailSkeleton />;
  }

  if (error) {
    return <div className="text-destructive-foreground bg-destructive/80 p-4 rounded-md">Error loading dispute: {error.message}</div>;
  }
  
  if (!disputeDoc) {
    notFound();
  }

  const buyer = users[disputeDoc.buyerId];
  const seller = users[disputeDoc.sellerId];

  if (!buyer || !seller) {
    return <DisputeDetailSkeleton />;
  }
  
  const finalDisputeData: Dispute = {
    ...disputeDoc,
    id,
    buyer,
    seller,
    chatTranscript: chatMessages || [],
    evidence: evidence || [],
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
          />
          <EvidenceGallery evidence={finalDisputeData.evidence} />
        </>
      }
      arbitratorTools={<AiAnalysisCard dispute={finalDisputeData} />}
    />
  );
}
