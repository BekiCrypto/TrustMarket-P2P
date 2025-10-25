
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { resolveDispute } from '@/app/actions/dispute';
import { useUser } from '@/firebase';
import type { AnalyzeDisputeEvidenceOutput } from '@/ai/flows/ai-analyze-dispute-evidence';

interface FinalizeDecisionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  disputeId: string;
  suggestedSplit: AnalyzeDisputeEvidenceOutput['suggestedEscrowSplit'];
}

export function FinalizeDecisionDialog({
  isOpen,
  onOpenChange,
  disputeId,
  suggestedSplit,
}: FinalizeDecisionDialogProps) {
  const [finalReasoning, setFinalReasoning] = useState(suggestedSplit.reasoning);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to perform this action.',
      });
      return;
    }
    if (!finalReasoning.trim()) {
        toast({
            variant: 'destructive',
            title: 'Missing Reasoning',
            description: 'Please provide the final reasoning for your decision.',
        });
        return;
    }


    setIsSubmitting(true);
    const response = await resolveDispute({
        disputeId,
        finalReasoning,
        buyerPercentage: suggestedSplit.buyerPercentage,
        sellerPercentage: suggestedSplit.sellerPercentage,
        resolvedBy: user.uid,
    });
    setIsSubmitting(false);

    if (response.success) {
      toast({
        title: 'Dispute Resolved',
        description: response.message,
      });
      onOpenChange(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Resolution Failed',
        description: response.error || 'An unknown error occurred.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finalize Decision for Case #{disputeId}</DialogTitle>
          <DialogDescription>
            Review the suggested split and add your final notes. This action
            will resolve the dispute and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Suggested Split</h4>
            <div className="flex justify-between rounded-lg border p-3">
              <span>Buyer Gets: <strong>{suggestedSplit.buyerPercentage}%</strong></span>
              <span>Seller Gets: <strong>{suggestedSplit.sellerPercentage}%</strong></span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="final-reasoning">
              Arbitrator's Final Notes & Reasoning
            </Label>
            <Textarea
              id="final-reasoning"
              value={finalReasoning}
              onChange={(e) => setFinalReasoning(e.target.value)}
              className="min-h-[120px]"
              placeholder="Explain the final decision..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              'Confirm & Resolve Dispute'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
