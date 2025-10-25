export interface UserProfile {
  id: string;
  name: string;
  avatarId: string;
  reputation: number;
  trades: number;
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
