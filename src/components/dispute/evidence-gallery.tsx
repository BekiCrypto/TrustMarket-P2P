import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getImageById } from '@/lib/placeholder-images';
import { Paperclip } from 'lucide-react';

type EvidenceGalleryProps = {
  receiptIds: string[];
};

export function EvidenceGallery({ receiptIds }: EvidenceGalleryProps) {
  const images = receiptIds.map(getImageById).filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Paperclip className="h-5 w-5" /> Uploaded Evidence
        </CardTitle>
      </CardHeader>
      <CardContent>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((image) =>
              image ? (
                <div key={image.id} className="group relative overflow-hidden rounded-lg">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    data-ai-hint={image.imageHint}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No evidence has been uploaded.</p>
        )}
      </CardContent>
    </Card>
  );
}
