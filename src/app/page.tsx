'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/layout/site-header';
import { ListingGrid } from '@/components/listings/listing-grid';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="container text-center py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
            The Secure P2P Marketplace
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Buy and sell with confidence. Our smart-contract escrow ensures your funds are safe until the deal is done.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="#listings">Browse Listings</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/listings/new">Create a Listing</Link>
            </Button>
          </div>
        </section>

        <section id="listings" className="container pb-20 md:pb-32">
            <h2 className="text-3xl font-bold text-center mb-12">Latest Listings</h2>
            <ListingGrid />
        </section>
      </main>

      <footer className="py-6 md:px-8 md:py-0 bg-background/95 backdrop-blur">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built by <a href="#" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">P2P TrustMarket</a>.
            </p>
        </div>
      </footer>
    </div>
  );
}
