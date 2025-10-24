'use server';
/**
 * @fileOverview An AI agent that analyzes dispute evidence and suggests an equitable escrow split.
 *
 * - analyzeDisputeEvidence - A function that analyzes dispute evidence and suggests an equitable split of the escrow.
 * - AnalyzeDisputeEvidenceInput - The input type for the analyzeDisputeEvidence function.
 * - AnalyzeDisputeEvidenceOutput - The return type for the analyzeDisputeEvidence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDisputeEvidenceInputSchema = z.object({
  chatTranscript: z
    .string()
    .describe('The chat transcript between the buyer and seller.'),
  buyerReputation: z.number().describe('The reputation score of the buyer.'),
  sellerReputation: z.number().describe('The reputation score of the seller.'),
  receipts: z.array(z.string()).describe('The receipts uploaded as evidence.'),
});
export type AnalyzeDisputeEvidenceInput = z.infer<
  typeof AnalyzeDisputeEvidenceInputSchema
>;

const AnalyzeDisputeEvidenceOutputSchema = z.object({
  suggestedEscrowSplit: z
    .object({
      buyerPercentage: z
        .number()
        .min(0)
        .max(100)
        .describe(
          'The suggested percentage of the escrow to be returned to the buyer.'
        ),
      sellerPercentage: z
        .number()
        .min(0)
        .max(100)
        .describe(
          'The suggested percentage of the escrow to be released to the seller.'
        ),
      reasoning: z.string().describe('The reasoning behind the suggested split.'),
    })
    .describe('The suggested escrow split between buyer and seller.'),
});
export type AnalyzeDisputeEvidenceOutput = z.infer<
  typeof AnalyzeDisputeEvidenceOutputSchema
>;

export async function analyzeDisputeEvidence(
  input: AnalyzeDisputeEvidenceInput
): Promise<AnalyzeDisputeEvidenceOutput> {
  return analyzeDisputeEvidenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDisputeEvidencePrompt',
  input: {schema: AnalyzeDisputeEvidenceInputSchema},
  output: {schema: AnalyzeDisputeEvidenceOutputSchema},
  prompt: `You are an experienced dispute arbitrator specializing in P2P marketplace disputes.

You will analyze the provided chat transcript, buyer reputation, seller reputation, and receipts to determine an equitable split of the escrow.

Consider all the evidence to determine a percentage split of the escrow between the buyer and the seller. Clearly explain your reasoning for the suggested split.

Chat Transcript: {{{chatTranscript}}}
Buyer Reputation: {{{buyerReputation}}}
Seller Reputation: {{{sellerReputation}}}
Receipts: {{#each receipts}}{{{this}}}\n{{/each}}

Based on this information, what is a fair split of the escrow? Be sure to set buyerPercentage and sellerPercentage appropriately.

Output in JSON format:
{{ zodFormat=AnalyzeDisputeEvidenceOutputSchema }}`,
});

const analyzeDisputeEvidenceFlow = ai.defineFlow(
  {
    name: 'analyzeDisputeEvidenceFlow',
    inputSchema: AnalyzeDisputeEvidenceInputSchema,
    outputSchema: AnalyzeDisputeEvidenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
