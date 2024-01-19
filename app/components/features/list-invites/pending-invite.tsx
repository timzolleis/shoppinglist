import { ListInvite } from '@prisma/client';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Trash } from 'lucide-react';
import { Form } from '@remix-run/react';
import { LIST_INVITE_INTENTS } from '~/routes/_app.lists_.$listId.members';
import { useIsLoading } from '~/utils/hooks/use-is-loading';
import { Loader } from '~/components/ui/loader';

export type PendingInvite = {
  email: string;
  id: ListInvite['id'];
}
export const PendingInvite = ({ invite }: { invite: PendingInvite }) => {
  const isLoading = useIsLoading((formData) => formData?.get('inviteId') === invite.id);
  return <div className={'flex items-center justify-between py-2'}>
    <div className={'flex items-center gap-2'}>
      <Avatar>
        <AvatarFallback className={'capitalize'}>{invite.email.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className={'space-y-1'}>
        <p className={'font-medium text-sm'}>{invite.email}</p>
      </div>
    </div>
    <Form method={'post'}>
      <input type="hidden" name={'inviteId'} value={invite.id} />
      <button name={'intent'} value={LIST_INVITE_INTENTS.DELETE}> {isLoading ? <Loader className={'bg-primary'} /> :
        <Trash className={'w-4 h-4 hover:cursor-pointer'} />}</button>
    </Form>
  </div>;
};