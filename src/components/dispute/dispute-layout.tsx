import type { ReactNode } from 'react';

type DisputeLayoutProps = {
  caseDetails: ReactNode;
  evidence: ReactNode;
  arbitratorTools: ReactNode;
};

export function DisputeLayout({
  caseDetails,
  evidence,
  arbitratorTools,
}: DisputeLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="flex flex-col gap-6 lg:col-span-3">
        {caseDetails}
      </div>
      <div className="flex flex-col gap-6 lg:col-span-5">
        {evidence}
      </div>
      <div className="flex flex-col gap-6 lg:col-span-4">
        {arbitratorTools}
      </div>
    </div>
  );
}
