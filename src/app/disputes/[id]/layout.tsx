import { AppLayout } from '@/components/layout/app-layout';

export default function DisputeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
