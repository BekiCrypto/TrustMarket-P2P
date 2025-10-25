
'use client';

import { useState } from 'react';
import { WandSparkles, Loader2, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getAiSuggestion } from '@/app/actions/dispute';
import type { Dispute, DisputeDocument } from '@/types';
import type { AnalyzeDisputeEvidenceOutput } from '@/ai/flows/ai-analyze-dispute-evidence';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { FinalizeDecisionDialog } from './finalize-decision-dialog';

type AiAnalysisCardProps = {
  dispute: Dispute;
  disputeDoc: DisputeDocument;
};

export function AiAnalysisCard({ dispute, disputeDoc }: AiAnalysisCardProps) {
  const [isAnalysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDisputeEvidenceOutput | null>(null);
  const [isFinalizeDialogOpen, setFinalizeDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setAnalysisLoading(true);
    setAnalysisResult(null);

    const input = {
      chatTranscript: dispute.chatTranscript.map(m => `${m.senderId === dispute.buyer.id ? 'Buyer' : 'Seller'}: ${m.message}`).join('\n'),
      buyerReputation: dispute.buyer.reputation,
      sellerReputation: dispute.seller.reputation,
      receipts: dispute.receiptIds,
    };

    const response = await getAiSuggestion(input);
    setAnalysisLoading(false);

    if (response.success && response.data) {
      setAnalysisResult(response.data);
      toast({
        title: 'Analysis Complete',
        description: 'AI has provided a suggested resolution.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: response.error || 'An unknown error occurred.',
      });
    }
  };

  const isResolved = disputeDoc.status === 'Resolved';

  return (
    <>
    <Card className={isResolved ? "bg-green-500/10 border-green-500/30" : "bg-primary/5 border-primary/20"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WandSparkles className={cn("h-5 w-5", isResolved ? "text-green-500" : "text-primary")} />
          {isResolved ? 'Dispute Resolved' : 'AI Resolution Assistant'}
        </CardTitle>
        <CardDescription>
            {isResolved ? 'This case has been closed. See the final resolution below.' : 'Use AI to analyze the evidence and get a suggested escrow split.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAnalysisLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border p-8 text-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Analyzing evidence... This may take a moment.
            </p>
          </div>
        ) : analysisResult || isResolved ? (
            <div className="space-y-6">
                <div>
                <h3 className="mb-2 text-base font-semibold">Final Split</h3>
                <div className="space-y-4 rounded-lg bg-background/50 p-4">
                    <div>
                    <div className="mb-1 flex justify-between text-sm font-medium">
                        <span>Buyer ({dispute.buyer.name})</span>
                        <span className="font-bold">{isResolved ? disputeDoc.resolution?.buyerPercentage : analysisResult?.suggestedEscrowSplit.buyerPercentage}%</span>
                    </div>
                    <Progress value={isResolved ? disputeDoc.resolution?.buyerPercentage : analysisResult?.suggestedEscrowSplit.buyerPercentage} className="h-3" />
                    </div>
                    <div>
                    <div className="mb-1 flex justify-between text-sm font-medium">
                        <span>Seller ({dispute.seller.name})</span>
                        <span className="font-bold">{isResolved ? disputeDoc.resolution?.sellerPercentage : analysisResult?.suggestedEscrowSplit.sellerPercentage}%</span>
                    </div>
                    <Progress value={isResolved ? disputeDoc.resolution?.sellerPercentage : analysisResult?.suggestedEscrowSplit.sellerPercentage} className="h-3" />
                    </div>
                </div>
                </div>
                <div>
                <h3 className="mb-2 text-base font-semibold">Reasoning</h3>
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>{isResolved ? 'Arbitrator\'s Final Notes' : 'AI\'s Rationale'}</AlertTitle>
                    <AlertDescription className="text-sm leading-relaxed">
                        {isResolved ? disputeDoc.resolution?.finalReasoning : analysisResult?.suggestedEscrowSplit.reasoning}
                    </AlertDescription>
                </Alert>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center h-64">
             <WandSparkles className="h-10 w-10 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground font-medium">
              Ready to analyze dispute evidence.
            </p>
             <p className="text-xs text-muted-foreground mt-1">
              Click the button below to start the AI analysis.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        {!isResolved && (
            <Button onClick={handleAnalysis} disabled={isAnalysisLoading}>
            {isAnalysisLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
                </>
            ) : analysisResult ? 'Re-analyze Evidence' : 'Analyze Evidence'}
            </Button>
        )}
        {(analysisResult && !isResolved) && (
             <Button variant="default" onClick={() => setFinalizeDialogOpen(true)}>Finalize Decision</Button>
        )}
      </CardFooter>
    </Card>

    {analysisResult && (
        <FinalizeDecisionDialog
            isOpen={isFinalizeDialogOpen}
            onOpenChange={setFinalizeDialogOpen}
            disputeId={dispute.id}
            suggestedSplit={analysisResult.suggestedEscrowSplit}
        />
    )}
    </>
  );
}

function cn(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}
