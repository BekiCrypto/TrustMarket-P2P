import type { UserProfile } from '@/types';

export type DisputeOverview = {
  id: string;
  status: 'Open' | 'Resolved' | 'Pending';
  dateInitiated: string;
  buyerId: string;
  sellerId: string;
};

// This function is now deprecated as we fetch from Firestore, but we keep it for reference.
export const getAllDisputes = (): DisputeOverview[] => [
  {
    id: '1',
    status: 'Open',
    dateInitiated: '2023-10-28',
    buyerId: 'user-001',
    sellerId: 'user-002',
  },
  {
    id: '2',
    status: 'Resolved',
    dateInitiated: '2023-10-25',
    buyerId: 'user-003',
    sellerId: 'user-004',
  },
  {
    id: '3',
    status: 'Pending',
    dateInitiated: '2023-11-01',
    buyerId: 'user-005',
    sellerId: 'user-006',
  },
  {
    id: '4',
    status: 'Open',
    dateInitiated: '2023-11-02',
    buyerId: 'user-007',
    sellerId: 'user-001',
  },
  {
    id: '5',
    status: 'Resolved',
    dateInitiated: '2023-09-15',
    buyerId: 'user-002',
    sellerId: 'user-005',
  },
];
