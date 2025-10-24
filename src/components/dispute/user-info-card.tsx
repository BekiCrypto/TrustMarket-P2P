import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { UserProfile } from '@/types';
import { getImageById } from '@/lib/placeholder-images';
import { Star, Repeat } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type UserInfoCardProps = {
  user: UserProfile;
  role: 'Buyer' | 'Seller';
};

export function UserInfoCard({ user, role }: UserInfoCardProps) {
  const avatar = getImageById(user.avatarId);
  const reputationColor =
    user.reputation > 95
      ? 'bg-green-500'
      : user.reputation > 85
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
        <Avatar className="h-12 w-12">
          {avatar && <AvatarImage src={avatar.imageUrl} alt={user.name} data-ai-hint={avatar.imageHint} />}
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <CardTitle className="text-lg">{user.name}</CardTitle>
          <Badge variant={role === 'Buyer' ? 'default' : 'secondary'} className="w-fit">
            {role}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <div className='flex justify-between items-center'>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Star className="h-4 w-4" /> Reputation</p>
                <span className="font-semibold">{user.reputation}%</span>
            </div>
          <Progress value={user.reputation} className="h-2" aria-label={`${user.reputation}% reputation`} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <p className="font-medium text-muted-foreground flex items-center gap-2"><Repeat className="h-4 w-4" /> Completed Trades</p>
          <span className="font-semibold">{user.trades}</span>
        </div>
      </CardContent>
    </Card>
  );
}
