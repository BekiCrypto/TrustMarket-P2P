import type { UserProfile } from '@/types';

export type Listing = {
  id: string;
  title: string;
  seller: Pick<UserProfile, 'id' | 'name' | 'avatarId'>;
  price: number;
  status: 'Active' | 'Sold' | 'Suspended';
};

export const getListings = (): Listing[] => [
  {
    id: 'LST-001',
    title: 'Vintage Leather Jacket',
    seller: {
      id: 'user-002',
      name: 'Bob Williams',
      avatarId: 'avatar-2',
    },
    price: 150.0,
    status: 'Active',
  },
  {
    id: 'LST-002',
    title: 'Antique Wooden Chair',
    seller: {
      id: 'user-003',
      name: 'Charlie Brown',
      avatarId: 'avatar-4',
    },
    price: 75.5,
    status: 'Sold',
  },
  {
    id: 'LST-003',
    title: 'Signed Baseball Card',
    seller: {
      id: 'user-004',
      name: 'Diana Prince',
      avatarId: 'avatar-5',
    },
    price: 300.0,
    status: 'Active',
  },
  {
    id: 'LST-004',
    title: 'First Edition Novel',
    seller: {
      id: 'user-005',
      name: 'Ethan Hunt',
      avatarId: 'avatar-5',
    },
    price: 220.0,
    status: 'Suspended',
  },
  {
    id: 'LST-005',
    title: 'Handmade Pottery Vase',
    seller: {
      id: 'user-006',
      name: 'Fiona Glenanne',
      avatarId: 'avatar-6',
    },
    price: 45.0,
    status: 'Active',
  },
  {
    id: 'LST-006',
    title: 'Retro Video Game Console',
    seller: {
      id: 'user-001',
      name: 'Alice Johnson',
      avatarId: 'avatar-1',
    },
    price: 199.99,
    status: 'Sold',
  },
];
