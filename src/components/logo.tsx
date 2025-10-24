import { ShieldCheck } from 'lucide-react';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2" >
      <ShieldCheck className="h-6 w-6 text-primary" />
      <span className="font-semibold text-lg text-primary-foreground">P2P TrustMarket</span>
    </div>
  );
}
