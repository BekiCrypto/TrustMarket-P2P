'use client';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { ListingDocument } from '@/types';
import { ListingCard } from './listing-card';
import { Skeleton } from '../ui/skeleton';

export function ListingGrid() {
  const firestore = useFirestore();
  const listingsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'listings'), orderBy('title'), limit(6)) : null),
    [firestore]
  );
  
  const { data: listings, isLoading, error } = useCollection<ListingDocument & {id: string}>(listingsQuery);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-96 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive-foreground bg-destructive/80 p-4 rounded-md">
        Error loading listings: {error.message}
      </div>
    );
  }
  
  if (!listings || listings.length === 0) {
      return (
          <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-lg">
              <h3 className="text-xl font-medium">No listings found.</h3>
              <p>Check back later or be the first to create one!</p>
          </div>
      )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
