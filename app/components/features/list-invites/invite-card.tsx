import { ListInvite } from '@prisma/client';
import { Check, X } from 'lucide-react';
import { cn } from '~/utils/css/css';
import { Badge } from '~/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Form } from '@remix-run/react';
import { LIST_INVITE_INTENTS } from '~/routes/_app.lists_.$listId.members';
import { ListWithOwner } from '~/models/list.server';

type ListInviteWithList = ListInvite & { list: ListWithOwner };
type InviteStatus = 'pending' | 'accepted' | 'declined';
export const InviteCard = ({ invite }: { invite: ListInviteWithList }) => {
  const { t } = useTranslation('lists');
  return <div
    className={cn('flex flex-[2_2_0%] items-center justify-between')}>
    <div className={'grid'}>
      <div className={'flex items-center gap-4'}>
        <p className={'text-sm font-medium'}>{invite.list?.name}</p>
        <Badge
          size={'sm'}
          rounding={'md'}
          variant={invite.status === 'accepted' ? 'green' : invite.status === 'declined' ? 'red' : 'amber'}>{t(`invites.status.${invite.status as InviteStatus}`)}</Badge>
      </div>
      <p className={'text-xs text-muted-foreground'}>{invite.list?.owner.name}</p>
    </div>
    {!invite.usedAt && <Form method={'post'} className={'inline-flex gap-4'}>
      <input type="hidden" name={'inviteId'} value={invite.id} />
      <button name={'intent'} value={LIST_INVITE_INTENTS.ACCEPT}>
        <Check className={'w-5 h-5'} />
      </button>
      <button name={'intent'} value={LIST_INVITE_INTENTS.DECLINE}><X className={'w-5 h-5'}></X></button>
    </Form>}
  </div>;
}