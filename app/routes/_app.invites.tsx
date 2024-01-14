import { ActionFunctionArgs, defer, json, LoaderFunctionArgs } from '@remix-run/node';
import { requireAuthentication } from '~/utils/auth/authentication.server';
import { getSearchParam } from '~/utils/general/request.server';
import { findInvitesForUser } from '~/models/list-invites.server';
import { Await, useLoaderData } from '@remix-run/react';
import { PageHeader } from '~/components/features/page/page-header';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';
import { InviteCard } from '~/components/features/list-invites/invite-card';
import { zfd } from 'zod-form-data';
import { LIST_INVITE_INTENTS } from '~/routes/_app.lists_.$listId.invites';
import { getErrorMessage, getFormErrors } from '~/utils/error/error.server';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await requireAuthentication(request);
  const showAll = getSearchParam(request.url, 'showAll');
  //Get all invites for the user
  const invites = findInvitesForUser(user.email, showAll === 'true');
  return defer({ invites });
};

const listInviteSchema = zfd.formData({
  listId: zfd.text(),
  intent: zfd.text()
});

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  try {
    const { listId, intent } = listInviteSchema.parse(formData);
    switch (intent) {
      case LIST_INVITE_INTENTS.ACCEPT: {
        //TODO: Accept invite
        return json({ success: true });
      }
      case LIST_INVITE_INTENTS.DECLINE: {
        //TODO: Decline invite
        return json({ success: true });
      }
    }
  } catch (e) {
    return { error: getErrorMessage(e), formErrors: getFormErrors(e) };
  }

};


const InvitesPage = () => {
  const { invites } = useLoaderData<typeof loader>();
  const { t } = useTranslation('lists');

  return (
    <>
      <PageHeader>{t('invites.header')}</PageHeader>
      <Suspense>
        <Await resolve={invites}>
          {(invites) => (
            <div className={'grid gap-2'}>
              {invites.map(invite => <InviteCard key={invite.id} invite={invite} />)}
            </div>
          )}
        </Await>
      </Suspense></>
  );
};

export default InvitesPage;