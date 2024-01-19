import { ListInvite } from '@prisma/client';
import { Mail, Trash } from 'lucide-react';
import { Form } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { cn } from '~/utils/css/css';
import { LIST_INVITE_INTENTS } from '~/routes/_app.lists_.$listId.invites';
import { DateTime } from 'luxon';
import { useIsLoading } from '~/utils/hooks/use-is-loading';
import { Badge } from '~/components/ui/badge';
import { useTranslation } from 'react-i18next';

type InviteStatus = 'pending' | 'accepted' | 'declined';
export const InviteAdminCard = ({ invite }: { invite: ListInvite }) => {
  const { t } = useTranslation('lists');
  const isDeleting = useIsLoading((formData) => formData?.get('inviteId') === invite.id);
  return <div
    className={cn('px-5 py-3 rounded-lg border bg-secondary/20 flex items-center justify-between', isDeleting && 'opacity-50')}>
    <div className={'flex items-center gap-4'}>
      <Mail className={'text-muted'} size={24} />
      <div className={'grid gap-1'}>
        <div className={'flex items-center gap-2'}>
          <p className={'text-sm'}>{invite.email}</p>
          <Badge
            size={'sm'}
            rounding={'md'}
            variant={invite.status === 'accepted' ? 'green' : invite.status === 'declined' ? 'red' : 'amber'}>{t(`invites.status.${invite.status as InviteStatus}`)}</Badge>
        </div>
        <p
          className={'text-xs text-muted-foreground'}>{DateTime.fromISO(invite.createdAt).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}</p>
      </div>
    </div>
    <InviteDropdown invite={invite} />
  </div>;
};
const InviteDropdown = ({ invite }: { invite: ListInvite }) => {
  const isDeleting = useIsLoading((formData) => formData?.get('inviteId') === invite.id);
  return <div className={'flex items-center divide-x divide-border rounded-md border'}>
    <Form method={'post'}>
      <input type="hidden" name={'inviteId'} value={invite.id} />
      <Button disabled={isDeleting} name={'intent'} value={LIST_INVITE_INTENTS.DELETE} variant={'ghost'}
              className={cn('py-2 px-1 rounded-none group', isDeleting && 'text-muted')}><Trash
        className={'group-hover:rotate-12 group-hover:scale-110 group-hover:text-red-500 transition-all w-4 h-4 mx-2'} /></Button>
    </Form>
  </div>;
};