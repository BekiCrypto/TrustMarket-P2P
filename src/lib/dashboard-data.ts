export const getStats = () => ({
  totalDisputes: 1289,
  totalDisputesGrowth: 15.2,
  resolvedDisputes: 973,
  resolvedDisputesGrowth: 12.1,
  avgResolutionTime: '48.3 hours',
  avgResolutionTimeGrowth: -5.5,
  activeUsers: '5.2k',
  activeUsersGrowth: 8.7,
});

export const getChartData = () => [
  { month: 'January', created: 186, resolved: 150 },
  { month: 'February', created: 205, resolved: 180 },
  { month: 'March', created: 237, resolved: 200 },
  { month: 'April', created: 173, resolved: 150 },
  { month: 'May', created: 209, resolved: 180 },
  { month: 'June', created: 214, resolved: 195 },
];

export type RecentDispute = {
  id: string;
  user: {
    name: string;
    avatarId: string;
  };
  opponentName: string;
  status: 'Open' | 'Resolved' | 'Pending';
};

export const getRecentDisputes = (): RecentDispute[] => [
  {
    id: '1',
    user: { name: 'Alice Johnson', avatarId: 'avatar-1' },
    opponentName: 'Bob Williams',
    status: 'Open',
  },
  {
    id: '2',
    user: { name: 'Charlie Brown', avatarId: 'avatar-4' },
    opponentName: 'Diana Prince',
    status: 'Pending',
  },
  {
    id: '3',
    user: { name: 'Ethan Hunt', avatarId: 'avatar-5' },
    opponentName: 'Fiona Glenanne',
    status: 'Open',
  },
  {
    id: '4',
    user: { name: 'Grace O-Malley', avatarId: 'avatar-6' },
    opponentName: 'He-Man',
    status: 'Resolved',
  },
  {
    id: '5',
    user: { name: 'Ivy Pepper', avatarId: 'avatar-7' },
    opponentName: 'Jack Sparrow',
    status: 'Open',
  },
];
