
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Paperclip } from 'lucide-react';
import type { Evidence } from '@/types';

type EvidenceGalleryProps = {
  evidence: Evidence[];
};

export function EvidenceGallery({ evidence }: EvidenceGalleryProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Paperclip className="h-5 w-5" /> Uploaded Evidence
        </CardTitle>
      </CardHeader>
      <CardContent>
        {evidence && evidence.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {evidence.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-lg">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={item.url}
                    alt={item.description}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs text-center p-2">{item.description}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground p-8 border border-dashed rounded-lg">
            <Paperclip className="h-8 w-8" />
            <p>No evidence has been uploaded for this dispute.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
