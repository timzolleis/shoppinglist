import { User } from '@prisma/client';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';

export const ListMember = ({ member }: { member: User }) => {
  const initials = member.name.split(' ').map(name => name[0]).join('');
  return <div className={'flex items-center justify-between py-2'}>
    <div className={'flex items-center gap-2'}>
      <Avatar>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className={'space-y-1'}>
        <p className={'font-medium text-sm'}>{member.name}</p>
        <p className={'text-xs text-muted-foreground'}>{member.email}</p>
      </div>
    </div>
  </div>;
};