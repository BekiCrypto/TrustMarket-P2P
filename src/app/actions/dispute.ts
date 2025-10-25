
'use server';

import { analyzeDisputeEvidence, type AnalyzeDisputeEvidenceInput } from '@/ai/flows/ai-analyze-dispute-evidence';
import { doc, updateDoc } from 'firebase/firestore';
import { getSdks } from '@/firebase'; // Using admin-initialized version on server
import { revalidatePath } from 'next/cache';

export async function getAiSuggestion(input: AnalyzeDisputeEvidenceInput) {
  try {
    const result = await analyzeDisputeEvidence(input);
    // Simple validation
    if (
      result.suggestedEscrowSplit.buyerPercentage + result.suggestedEscrowSplit.sellerPercentage > 101 ||
      result.suggestedEscrowSplit.buyerPercentage + result.suggestedEscrowSplit.sellerPercentage < 99
    ) {
        // Fallback in case AI gives weird percentages
        if(result.suggestedEscrowSplit.buyerPercentage > result.suggestedEscrowSplit.sellerPercentage) {
            result.suggestedEscrowSplit.buyerPercentage = 100;
            result.suggestedEscrowSplit.sellerPercentage = 0;
        } else {
            result.suggestedEscrowSplit.buyerPercentage = 0;
            result.suggestedEscrowSplit.sellerPercentage = 100;
        }
    }
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    return { success: false, error: 'Failed to get AI suggestion.' };
  }
}

interface ResolveDisputeInput {
    disputeId: string;
    finalReasoning: string;
    buyerPercentage: number;
    sellerPercentage: number;
    resolvedBy: string; // UID of the arbitrator
}
  
export async function resolveDispute(input: ResolveDisputeInput) {
    // We can't use the client-side `useFirestore` hook in a server action.
    // We need to initialize the admin SDK to perform writes.
    const { firestore } = getSdks();
    
    if (!input.disputeId) {
        return { success: false, error: 'Dispute ID is required.' };
    }

    const disputeRef = doc(firestore, 'disputes', input.disputeId);

    try {
        await updateDoc(disputeRef, {
            status: 'Resolved',
            'resolution.finalReasoning': input.finalReasoning,
            'resolution.buyerPercentage': input.buyerPercentage,
            'resolution.sellerPercentage': input.sellerPercentage,
            'resolution.resolvedBy': input.resolvedBy,
            'resolution.resolvedAt': new Date().toISOString(),
        });

        // Revalidate the paths to ensure the UI updates with the new status
        revalidatePath('/disputes');
        revalidatePath(`/disputes/${input.disputeId}`);

        return { success: true, message: `Dispute #${input.disputeId} has been resolved.` };

    } catch (error) {
        console.error('Error resolving dispute:', error);
        return { success: false, error: 'Failed to update dispute in Firestore.' };
    }
}
