import type { UserProfile } from '@/types';

export type DisputeOverview = {
  id: string;
  status: 'Open' | 'Resolved' | 'Pending';
  dateInitiated: string;
  buyer: Pick<UserProfile, 'id' | 'name' | 'avatarId'>;
  seller: Pick<UserProfile, 'id' | 'name' | 'avatarId'>;
};

export const getAllDisputes = (): DisputeOverview[] => [
  {
    id: '1',
    status: 'Open',
    dateInitiated: '2023-10-28',
    buyer: {
      id: 'user-001',
      name: 'Alice Johnson',
      avatarId: 'avatar-1',
    },
    seller: {
      id: 'user-002',
      name: 'Bob Williams',
      avatarId: 'avatar-2',
    },
  },
  {
    id: '2',
    status: 'Resolved',
    dateInitiated: '2023-10-25',
    buyer: {
      id: 'user-003',
      name: 'Charlie Brown',
      avatarId: 'avatar-4',
    },
    seller: {
      id: 'user-004',
      name: 'Diana Prince',
      avatarId: 'avatar-5',
    },
  },
  {
    id: '3',
    status: 'Pending',
    dateInitiated: '2023-11-01',
    buyer: {
      id: 'user-005',
      name: 'Ethan Hunt',
      avatarId: 'avatar-5',
    },
    seller: {
      id: 'user-006',
      name: 'Fiona Glenanne',
      avatarId: 'avatar-6',
    },
  },
  {
    id: '4',
    status: 'Open',
    dateInitiated: '2023-11-02',
    buyer: {
      id: 'user-007',
      name: 'Grace O-Malley',
      avatarId: 'avatar-6',
    },
    seller: {
      id: 'user-001',
      name: 'Alice Johnson',
      avatarId: 'avatar-1',
    },
  },
  {
    id: '5',
    status: 'Resolved',
    dateInitiated: '2023-09-15',
    buyer: {
      id: 'user-002',
      name: 'Bob Williams',
      avatarId: 'avatar-2',
    },
    seller: {
      id: 'user-005',
      name: 'Ethan Hunt',
      avatarId: 'avatar-5',
    },
  },
];
