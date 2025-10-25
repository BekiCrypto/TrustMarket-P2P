import type { UserProfile } from '@/types';

export type User = UserProfile & {
  email: string;
  kycStatus: 'Verified' | 'Pending' | 'Unverified' | 'Rejected';
};

export const getUsers = (): User[] => [
  {
    id: 'user-001',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatarId: 'avatar-1',
    reputation: 98,
    trades: 124,
    kycStatus: 'Verified',
  },
  {
    id: 'user-002',
    name: 'Bob Williams',
    email: 'bob@example.com',
    avatarId: 'avatar-2',
    reputation: 92,
    trades: 312,
    kycStatus: 'Verified',
  },
  {
    id: 'user-003',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    avatarId: 'avatar-4',
    reputation: 85,
    trades: 45,
    kycStatus: 'Pending',
  },
  {
    id: 'user-004',
    name: 'Diana Prince',
    email: 'diana@example.com',
    avatarId: 'avatar-5',
    reputation: 99,
    trades: 502,
    kycStatus: 'Verified',
  },
  {
    id: 'user-005',
    name: 'Ethan Hunt',
    email: 'ethan@example.com',
    avatarId: 'avatar-5',
    reputation: 76,
    trades: 12,
    kycStatus: 'Unverified',
  },
  {
    id: 'user-006',
    name: 'Fiona Glenanne',
    email: 'fiona@example.com',
    avatarId: 'avatar-6',
    reputation: 68,
    trades: 88,
    kycStatus: 'Rejected',
  },
  {
    id: 'user-007',
    name: 'Grace O-Malley',
    email: 'grace@example.com',
    avatarId: 'avatar-6',
    reputation: 95,
    trades: 210,
    kycStatus: 'Verified',
  },
];
