'use server';

import { analyzeDisputeEvidence, type AnalyzeDisputeEvidenceInput } from '@/ai/flows/ai-analyze-dispute-evidence';

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
