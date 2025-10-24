import { notFound } from 'next/navigation';
import { getDisputeById } from '@/lib/data';
import { DisputeLayout } from '@/components/dispute/dispute-layout';
import { UserInfoCard } from '@/components/dispute/user-info-card';
import { ChatTranscript } from '@/components/dispute/chat-transcript';
import { EvidenceGallery } from '@/components/dispute/evidence-gallery';
import { AiAnalysisCard } from '@/components/dispute/ai-analysis-card';

export default function DisputePage({ params }: { params: { id: string } }) {
  const dispute = getDisputeById(params.id);

  if (!dispute) {
    notFound();
  }

  return (
    <DisputeLayout
      caseDetails={
        <>
          <UserInfoCard user={dispute.buyer} role="Buyer" />
          <UserInfoCard user={dispute.seller} role="Seller" />
        </>
      }
      evidence={
        <>
          <ChatTranscript 
            messages={dispute.chatTranscript} 
            buyerId={dispute.buyer.id} 
            sellerId={dispute.seller.id}
          />
          <EvidenceGallery receiptIds={dispute.receiptIds} />
        </>
      }
      arbitratorTools={<AiAnalysisCard dispute={dispute} />}
    />
  );
}
