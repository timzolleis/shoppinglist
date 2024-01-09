import { defer, json, LoaderFunctionArgs } from '@remix-run/node';
import { requireRouteParam } from '~/utils/general/request.server';
import { requireAuthentication } from '~/utils/auth/authentication.server';
import { findListWithOwnerById } from '~/models/list.server';
import { requireListOwnership } from '~/utils/list/list.server';
import { Await, Link, Outlet, useLoaderData } from '@remix-run/react';
import { invariantResponse } from '@epic-web/invariant';
import { deleteInvite, findInvitesForList } from '~/models/list-invites.server';
import { NoInvites } from '~/components/features/list-invites/no-invites';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { InviteCard } from '~/components/features/list-invites/invite-card';
import { getErrorMessage, getFormErrors } from '~/utils/error/error.server';
import { LIST_LINKS } from '~/links/list';
import { buttonVariants } from '~/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const listId = requireRouteParam('listId', params);
  const user = await requireAuthentication(request);
  const list = await findListWithOwnerById(listId);
  invariantResponse(list, 'List not found');
  requireListOwnership(list, user);
  //Find all members of the list
  const invites = findInvitesForList(listId);
  return defer({ list, invites });

};

export const inviteSchemas = {
  create: zfd.formData({
    email: zfd.text(z.string().email())
  }),
  delete: zfd.formData({
    inviteId: zfd.text()
  })
};

export const LIST_INVITE_INTENTS = {
  DELETE: 'delete'
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const listId = requireRouteParam('listId', params);
  const user = await requireAuthentication(request);
  const list = await findListWithOwnerById(listId);
  invariantResponse(list, 'List not found');
  requireListOwnership(list, user);
  const formData = await request.formData();
  const intent = formData.get('intent');
  switch (intent) {
    case LIST_INVITE_INTENTS.DELETE: {
      try {
        const { inviteId } = inviteSchemas.delete.parse(formData);
        await deleteInvite(inviteId);
        return json({ success: true });
      } catch (e) {
        return json({ formErrors: getFormErrors(e), error: getErrorMessage(e) });
      }
    }
    default: {
      return json({ error: 'NOT_IMPLEMENTED' }, { status: 501 });
    }
  }


};


const ListMembersPage = () => {
  const { list, invites } = useLoaderData<typeof loader>();
  const { t } = useTranslation('lists');
  return <div>
    <Outlet />
    <div className={'flex justify-end mt-4'}>
      <Link to={LIST_LINKS.INVITES_NEW(list.id)} className={buttonVariants()}>{t('invites.new.buttons.create')}</Link>
    </div>
    <div className={'mt-4 grid gap-2'}>
      <Suspense fallback={<InvitesFallback />}>
        <Await resolve={invites}>
          {invites => (
            <>
              {invites.length === 0 && <NoInvites />}
              {invites.map((invite) => (
                <InviteCard key={invite.id} invite={invite} />
              ))}
            </>
          )}
        </Await>
      </Suspense>
    </div>
  </div>;
};

const InvitesFallback = () => {
  const emptyArray = new Array(5).fill(0);
  return <>
    {emptyArray.map((entry, index) => (
      <div key={index} className={'w-full h-16 animate-pulse bg-muted rounded-md'}></div>
    ))}
  </>;


};



export default ListMembersPage;