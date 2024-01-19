import { defer, json, LoaderFunctionArgs } from '@remix-run/node';
import { requireRouteParam } from '~/utils/general/request.server';
import { requireAuthentication } from '~/utils/auth/authentication.server';
import { findListMembers, findListWithOwner, findListWithOwnerAndTagsById } from '~/models/list.server';
import { requireListOwnership } from '~/utils/list/list.server';
import { Await, useFetcher, useLoaderData } from '@remix-run/react';
import { invariantResponse } from '@epic-web/invariant';
import { NoMembers } from '~/components/features/list-members/no-members';
import React, { Suspense, useEffect } from 'react';
import { ListMember } from '~/components/features/list/list-member';
import { MaxWidth } from '~/components/ui/max-width';
import { useTranslation } from 'react-i18next';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import {
  createInvite,
  deleteInvite,
  findListInvites,
  getPendingInvitesForEmailAndList
} from '~/models/list-invites.server';
import { PendingInvite } from '~/components/features/list-invites/pending-invite';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { getFormErrors } from '~/utils/error/error.server';
import { useIsLoading } from '~/utils/hooks/use-is-loading';
import { usePendingInvites } from '~/utils/hooks/use-pending-invites';
import { useToast } from '~/components/ui/use-toast';
import { createId } from '@paralleldrive/cuid2';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const listId = requireRouteParam('listId', params);
  const user = await requireAuthentication(request);
  const list = await findListWithOwnerAndTagsById(listId);
  invariantResponse(list, 'List not found');
  requireListOwnership(list, user);
  //Find all members of the list
  const members = findListMembers(listId);
  const invites = findListInvites(listId);
  return defer({ list, members, invites });
};

export const inviteSchemas = {
  create: zfd.formData({
    email: zfd.text(z.string().email()),
    id: zfd.text()
  }),
  delete: zfd.formData({
    inviteId: zfd.text()
  })
};

export const LIST_INVITE_INTENTS = {
  CREATE: 'create',
  DELETE: 'delete',
  ACCEPT: 'accept',
  DECLINE: 'decline'
};

type ActionData = {
  success: boolean;
  errors?: {
    email?: typeof ERRORS[keyof typeof ERRORS];
  }
}

const ERRORS = {
  ALREADY_MEMBER: 'errors.alreadyMember',
  ALREADY_INVITED: 'errors.alreadyInvited',
  EMAIL_INVALID: 'errors.emailInvalid',
  EMAIL_REQUIRED: 'errors.emailRequired',
  REQUIRED: 'errors.required'
} as const;

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const listId = requireRouteParam('listId', params);
  const user = await requireAuthentication(request);
  const list = await findListWithOwner(listId);
  invariantResponse(list, 'List not found');
  requireListOwnership(list, user);
  const formData = await request.formData();
  const intent = formData.get('intent');
  switch (intent) {
    case LIST_INVITE_INTENTS.CREATE: {
      try {
        const { email, id } = inviteSchemas.create.parse(formData);
        //Check if the user is already a member
        const members = await findListMembers(listId);
        if (members.find(member => member.email === email)) {
          return json({ success: false, errors: { email: 'errors.alreadyMember' } });
        }
        //Check if there is already an invite for this email
        const pendingInvites = await getPendingInvitesForEmailAndList(email, listId);
        if (pendingInvites.length > 0) {
          return json({ success: false, errors: { email: 'errors.alreadyInvited' } });
        }
        await createInvite(id, listId, email);
        return json({ success: true });
      } catch (e) {
        return json({ success: false, errors: getFormErrors(e) });
      }
    }
    case LIST_INVITE_INTENTS.DELETE: {
      try {
        const { inviteId } = inviteSchemas.delete.parse(formData);
        await deleteInvite(inviteId);
        return json({ success: true });
      } catch (e) {
        return json({ success: false, errors: getFormErrors(e) });
      }
    }
  }
};

const ListMembersPage = () => {
  const { list, invites, members } = useLoaderData<typeof loader>();
  const { t } = useTranslation('lists');
  const pendingInvites = usePendingInvites();
  return <div className={'mt-4'}>
    <MaxWidth>
      <h2 className={'pb-4 font-medium text-xl'}>{t('invites.new.header')}</h2>
      <CreateInviteForm />
      <Separator className={'my-10'} />
      <Suspense>
        <p className={'font-medium text-sm text-muted-foreground'}>{t('listDetailsLayout.members')}</p>
        <main className={'mt-4'}><Await resolve={members}>
          {(members) => (
            <>
              {members.length === 0 && <NoMembers />}
              {members.map(member => (
                <ListMember member={member} key={member.id} />
              ))}
            </>
          )}
        </Await></main>
      </Suspense>
      <Separator className={'my-5'} />
      <Suspense fallback={<p>Loading</p>}>
        <p className={'font-medium text-sm text-muted-foreground'}>{t('listDetailsLayout.pendingInvites')}</p>
        <main className={'mt-4'}><Await resolve={invites}>
          {(invites) => {
            const merged = pendingInvites.length > 0 ? [...pendingInvites, ...invites] : invites;
            return (
              <>
                {merged.sort((a, b) => {
                  return a.email.localeCompare(b.email);
                }).map(invite => (
                  <PendingInvite invite={invite} key={invite.id} />
                ))}
              </>
            );
          }}

        </Await></main>
      </Suspense>
    </MaxWidth>

  </div>;
};


const CreateInviteForm = () => {
  const isCreatingInvite = useIsLoading((formData) => !!formData?.has('email'));
  const { t } = useTranslation('lists');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<ActionData>();
  const { toast } = useToast();
  useEffect(() => {
    if (inputRef.current && fetcher.formAction) {
      inputRef.current.value = '';
    }
  }, [fetcher]);
  //TODO: Use flash session
  useEffect(() => {
    if (fetcher.data?.success === false) {
      toast({
        title: 'Error',
        description: fetcher.data.errors?.email
      });
    }
  }, [fetcher]);
  return (
    <fetcher.Form method={'post'} className={'space-y-4'}>
      <input type="hidden" name={'intent'} value={LIST_INVITE_INTENTS.CREATE} />
      <input type={'hidden'} name={'id'} value={createId()} />
      <div className={'space-y-2'}>
        <Label>{t('invites.new.fields.email.label')}</Label>
        <div className={'flex gap-4'}>
          <Input ref={inputRef} type={'email'} name={'email'} placeholder={t('invites.new.fields.email.placeholder')} />
          <Button isLoading={isCreatingInvite} size={'sm'}>{t('invites.new.buttons.create')}</Button>
        </div>
      </div>
    </fetcher.Form>
  );

};
export default ListMembersPage;