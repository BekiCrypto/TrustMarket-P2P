
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
import { Skeleton } from '../ui/skeleton';

type ChatTranscriptProps = {
  messages: ChatMessage[];
  buyerId: string;
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
            {messages && messages.length > 0 ? messages.map((msg, index) => (
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
                      'text-xs mt-1 text-right',
                      msg.senderId === buyerId ? 'text-muted-foreground' : 'text-primary-foreground/70'
                  )}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground h-full p-8">
                <MessageSquare className="h-8 w-8" />
                <p>No chat messages found for this dispute.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
