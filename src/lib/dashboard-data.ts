// This file is now deprecated as we fetch live data from Firestore in the dashboard component.
// It is kept for reference or potential future use with historical data.

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

    