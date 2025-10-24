import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';
import { MessageSquare } from 'lucide-react';

type ChatTranscriptProps = {
  messages: ChatMessage[];
  buyerId: string;
  sellerId: string;
};

export function ChatTranscript({ messages, buyerId }: ChatTranscriptProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> Chat Transcript
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full pr-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-end gap-2',
                  msg.senderId === buyerId ? 'justify-start' : 'justify-end'
                )}
              >
                <div
                  className={cn(
                    'max-w-xs rounded-lg p-3 lg:max-w-md',
                    msg.senderId === buyerId
                      ? 'bg-secondary rounded-bl-none'
                      : 'bg-primary text-primary-foreground rounded-br-none'
                  )}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className={cn(
                      'text-xs mt-1',
                      msg.senderId === buyerId ? 'text-muted-foreground' : 'text-primary-foreground/70'
                  )}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
