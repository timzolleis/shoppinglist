import { List, ListInvite } from '@prisma/client';
import { Check, Mail, X } from 'lucide-react';
import { cn } from '~/utils/css/css';
import { Badge } from '~/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Form } from '@remix-run/react';
import { LIST_INVITE_INTENTS } from '~/routes/_app.lists_.$listId.invites';

type ListInviteWithList = ListInvite & { list: List };
type InviteStatus = 'pending' | 'accepted' | 'declined';
export const InviteCard = ({ invite }: { invite: ListInviteWithList }) => {
  const { t } = useTranslation('lists');
  return <div
    className={cn('px-5 py-3 rounded-lg border bg-secondary/20 flex items-center justify-between')}>
    <div className={'flex items-center gap-4'}>
      <Mail className={'text-muted'} size={24} />
      <div className={'grid gap-1'}>
        <div className={'flex items-center gap-2'}>
          <p className={'text-sm'}>{invite.list.name}</p>
          <Badge
            size={'sm'}
            rounding={'md'}
            variant={invite.status === 'accepted' ? 'green' : invite.status === 'declined' ? 'red' : 'amber'}>{t(`invites.status.${invite.status as InviteStatus}`)}</Badge>
        </div>
      </div>
    </div>
    <Form method={'post'} className={'inline-flex gap-4'}>
      <input type="hidden" name={'inviteId'} value={invite.id} />
      <button name={'intent'} value={LIST_INVITE_INTENTS.ACCEPT}>
        <Check className={'w-5 h-5'} />
      </button>
      <button name={'intent'} value={LIST_INVITE_INTENTS.DECLINE}><X className={'w-5 h-5'}></X></button>
    </Form>
  </div>;
}