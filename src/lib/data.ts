import type { Dispute } from '@/types';

export const disputes: Dispute[] = [
  {
    id: '1',
    status: 'Open',
    buyer: {
      id: 'user-001',
      name: 'Alice Johnson',
      avatarId: 'avatar-1',
      reputation: 98,
      trades: 124,
    },
    seller: {
      id: 'user-002',
      name: 'Bob Williams',
      avatarId: 'avatar-2',
      reputation: 92,
      trades: 312,
    },
    chatTranscript: [
      { senderId: 'user-001', message: 'Hi, is this still available?', timestamp: '2023-10-26 10:00 AM' },
      { senderId: 'user-002', message: 'Yes it is!', timestamp: '2023-10-26 10:01 AM' },
      { senderId: 'user-001', message: 'Great, I will start the trade. I\'ve sent the payment, please check.', timestamp: '2023-10-26 10:05 AM' },
      { senderId: 'user-002', message: 'Received. I will ship it tomorrow morning.', timestamp: '2023-10-26 10:06 AM' },
      { senderId: 'user-001', message: 'Hey, I received the item but it\'s not as described. The screen is cracked.', timestamp: '2023-10-28 02:15 PM' },
      { senderId: 'user-002', message: 'What? It was in perfect condition when I sent it. You must have dropped it.', timestamp: '2023-10-28 02:16 PM' },
      { senderId: 'user-001', message: 'No, the packaging was also damaged. I took pictures. I want a refund.', timestamp: '2023-10-28 02:18 PM' },
      { senderId: 'user-002', message: 'I\'m not giving you a refund for something you broke. This is a scam.', timestamp: '2023-10-28 02:20 PM' },
    ],
    receiptIds: ['receipt-1', 'receipt-2', 'receipt-3'],
  },
];

export const getDisputeById = (id: string): Dispute | undefined => {
  return disputes.find((d) => d.id === id);
};
