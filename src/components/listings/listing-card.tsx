'use client';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getImageById } from '@/lib/placeholder-images';
import type { ListingDocument, UserProfile } from '@/types';
import { useUsers } from '@/firebase';

interface ListingCardProps {
  listing: ListingDocument & { id: string };
}

export function ListingCard({ listing }: ListingCardProps) {
  const { users: sellers, isLoading: sellersLoading } = useUsers([listing.sellerId]);
  const seller = sellers[listing.sellerId];
  
  // This could be improved to fetch a real image if available
  const listingImage = "https://picsum.photos/seed/" + listing.id + "/600/400";
  const sellerAvatar = seller ? getImageById(seller.avatarId) : null;
  
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <Image
                src={listingImage}
                alt={listing.title}
                fill
                className="object-cover"
                data-ai-hint="product image"
            />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <CardTitle className="text-lg font-semibold mb-2">{listing.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {seller ? (
                <>
                    <Avatar className="h-6 w-6">
                        {sellerAvatar && <AvatarImage src={sellerAvatar.imageUrl} alt={seller.name} />}
                        <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{seller.name}</span>
                </>
            ) : (
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-20 bg-muted animate-pulse rounded-md" />
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-xl font-bold">${listing.price.toFixed(2)}</div>
        <Button>View</Button>
      </CardFooter>
    </Card>
  );
}
