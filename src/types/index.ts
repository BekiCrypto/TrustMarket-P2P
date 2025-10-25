
export type UserKycStatus = 'Verified' | 'Pending' | 'Unverified' | 'Rejected';

export interface UserProfile {
  id: string;
  name: string;
  avatarId: string;
  reputation: number;
  trades: number;
  email?: string;
  kycStatus: UserKycStatus;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  message: string;
  timestamp: string; // ISO 8601 format
}

export interface Evidence {
    id: string;
    disputeId: string;
    url: string;
    description: string;
}

export interface Resolution {
    finalReasoning: string;
    buyerPercentage: number;
    sellerPercentage: number;
    resolvedBy: string; // UID of the arbitrator
    resolvedAt: string; // ISO timestamp
}

export interface DisputeDocument {
    buyerId: string;
    sellerId: string;
    status: 'Open' | 'Resolved' | 'Pending';
    dateInitiated: string; // ISO 8601 format
    resolution?: Resolution;
}

export interface Dispute extends DisputeDocument {
    id: string;
    buyer: UserProfile;
    seller: UserProfile;
    chatTranscript: ChatMessage[];
    evidence: Evidence[];
}

export interface ListingDocument {
    title: string;
    sellerId: string;
    price: number;
    status: 'Active' | 'Sold' | 'Suspended';
}
