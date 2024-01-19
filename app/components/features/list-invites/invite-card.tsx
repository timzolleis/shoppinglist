import { ListInvite } from '@prisma/client';
import { Check, Dot, X } from 'lucide-react';
import { cn } from '~/utils/css/css';
import { Badge } from '~/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Form } from '@remix-run/react';
import { LIST_INVITE_INTENTS } from '~/routes/_app.lists_.$listId.members';
import { ListWithOwner } from '~/models/list.server';
import { useLocale } from 'remix-i18next';
import { DateTime } from 'luxon';

type ListInviteWithList = ListInvite & { list: ListWithOwner };
type InviteStatus = 'pending' | 'accepted' | 'declined';
export const InviteCard = ({ invite }: { invite: ListInviteWithList }) => {
  const { t } = useTranslation('lists');
  const locale = useLocale();
  return <div
    className={cn('flex items-center justify-between')}>
    <div className={'space-y-3'}>
      <div className={'flex items-center gap-4'}>
        <p className={'text-sm font-medium'}>{invite.list?.name}</p>
        <Badge
          size={'sm'}
          rounding={'sm'}
          variant={invite.status === 'accepted' ? 'green' : invite.status === 'declined' ? 'red' : 'amber'}>{t(`invites.status.${invite.status as InviteStatus}`)}</Badge>
      </div>
      <div className={'text-xs text-muted-foreground flex items-center'}>
        <p className={''}>{invite.list?.owner.name}</p>
        <Dot />
        <p>{DateTime.fromISO(invite.createdAt).toLocaleString(DateTime.DATETIME_MED, { locale })}</p>
      </div>
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