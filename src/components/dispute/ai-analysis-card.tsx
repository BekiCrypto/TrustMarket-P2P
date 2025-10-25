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
import type { Dispute } from '@/types';
import type { AnalyzeDisputeEvidenceOutput } from '@/ai/flows/ai-analyze-dispute-evidence';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type AiAnalysisCardProps = {
  dispute: Dispute;
};

export function AiAnalysisCard({ dispute }: AiAnalysisCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeDisputeEvidenceOutput | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setIsLoading(true);
    setResult(null);

    const input = {
      chatTranscript: dispute.chatTranscript.map(m => `${m.senderId === dispute.buyer.id ? 'Buyer' : 'Seller'}: ${m.message}`).join('\n'),
      buyerReputation: dispute.buyer.reputation,
      sellerReputation: dispute.seller.reputation,
      receipts: dispute.receiptIds,
    };

    const response = await getAiSuggestion(input);
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
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

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WandSparkles className="h-5 w-5 text-primary" />
          AI Resolution Assistant
        </CardTitle>
        <CardDescription>
          Use AI to analyze the evidence and get a suggested escrow split.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border p-8 text-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Analyzing evidence... This may take a moment.
            </p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-base font-semibold">Suggested Split</h3>
              <div className="space-y-4 rounded-lg bg-background/50 p-4">
                <div>
                  <div className="mb-1 flex justify-between text-sm font-medium">
                    <span>Buyer ({dispute.buyer.name})</span>
                    <span className="font-bold">{result.suggestedEscrowSplit.buyerPercentage}%</span>
                  </div>
                  <Progress value={result.suggestedEscrowSplit.buyerPercentage} className="h-3" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm font-medium">
                    <span>Seller ({dispute.seller.name})</span>
                    <span className="font-bold">{result.suggestedEscrowSplit.sellerPercentage}%</span>
                  </div>
                  <Progress value={result.suggestedEscrowSplit.sellerPercentage} className="h-3" />
                </div>
              </div>
            </div>
             <div>
                <h3 className="mb-2 text-base font-semibold">Reasoning</h3>
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>AI's Rationale</AlertTitle>
                    <AlertDescription className="text-sm leading-relaxed">
                        {result.suggestedEscrowSplit.reasoning}
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
        <Button onClick={handleAnalysis} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : result ? 'Re-analyze Evidence' : 'Analyze Evidence'}
        </Button>
        {result && (
             <Button variant="outline">Finalize Decision</Button>
        )}
      </CardFooter>
    </Card>
  );
}

    