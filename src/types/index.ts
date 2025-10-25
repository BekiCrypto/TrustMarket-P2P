export interface UserProfile {
  id: string;
  name: string;
  avatarId: string;
  reputation: number;
  trades: number;
  email?: string;
}

export interface ChatMessage {
  senderId: string;
  message: string;
  timestamp: string;
}

export interface Dispute {
  id: string;
  status: 'Open' | 'Resolved' | 'Pending';
  buyer: UserProfile;
  seller: UserProfile;
  chatTranscript: ChatMessage[];
  receiptIds: string[];
  dateInitiated: string;
}

export interface DisputeDocument {
    buyerId: string;
    sellerId: string;
    status: 'Open' | 'Resolved' | 'Pending';
    dateInitiated: string; // Assuming this is a string, could be Timestamp
}

export interface ListingDocument {
    title: string;
    sellerId: string;
    price: number;
    status: 'Active' | 'Sold' | 'Suspended';
}
