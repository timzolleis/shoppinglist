import { ActionFunctionArgs, defer, json, LoaderFunctionArgs } from '@remix-run/node';
import { requireAuthentication } from '~/utils/auth/authentication.server';
import { getSearchParam } from '~/utils/general/request.server';
import { findInviteById, findInvitesForUser, updateInvite } from '~/models/list-invites.server';
import { Await, useLoaderData, useSearchParams } from '@remix-run/react';
import { PageHeader } from '~/components/features/page/page-header';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';
import { InviteCard } from '~/components/features/list-invites/invite-card';
import { zfd } from 'zod-form-data';
import { LIST_INVITE_INTENTS } from '~/routes/_app.lists_.$listId.members';
import { getErrorMessage, getFormErrors } from '~/utils/error/error.server';
import { updateList } from '~/models/list.server';
import { invariantResponse } from '@epic-web/invariant';
import { getNowAsISO } from '~/utils/date/date';
import { Tablink, TablinkContainer } from '~/components/ui/tablink';
import { NoInvitesForUser } from '~/components/features/list-invites/no-invites-for-user';


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireAuthentication(request);
  const showAll = getSearchParam(request.url, 'showAll');
  //Get all invites for the user
  const invites = findInvitesForUser(user.email, showAll === 'true');
  return defer({ invites });
};

const listInviteSchema = zfd.formData({
  intent: zfd.text(),
  inviteId: zfd.text()
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireAuthentication(request);
  const formData = await request.formData();
  try {
    const { inviteId, intent } = listInviteSchema.parse(formData);
    const invite = await findInviteById(inviteId);
    invariantResponse(invite, 'errors.inviteNotFound');
    switch (intent) {
      case LIST_INVITE_INTENTS.ACCEPT: {
        //First, add the user to the list
        await updateList(invite.listId, {
          members: {
            connect: {
              id: user.id
            }
          }
        });
        //Then, update the status of the invite
        await updateInvite(inviteId, {
          status: 'accepted',
          usedAt: getNowAsISO()
        });
        return json({ success: true });
      }
      case LIST_INVITE_INTENTS.DECLINE: {
        await updateInvite(inviteId, {
          status: 'declined',
          usedAt: getNowAsISO()
        });
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
  const [searchParams, setSearchParams] = useSearchParams();
  const showAll = searchParams.get('showAll') === 'true';
  const setShowAll = (showAll: boolean) => {
    searchParams.set('showAll', showAll.toString());
    setSearchParams(searchParams);
  };
  console.log(showAll);

  return (
    <>
      <PageHeader>{t('invites.header')}</PageHeader>
      <TablinkContainer>
        <Tablink to={'?showAll=false'} overrideIsActive={!showAll}>{t('listInvitesLayout.showOpen')}</Tablink>
        <Tablink to={'?showAll=true'} overrideIsActive={showAll}>{t('listInvitesLayout.showAll')}</Tablink>
      </TablinkContainer>
      <Suspense>
        <Await resolve={invites}>
          {(invites) => (
            <>
              {invites.length === 0 && <NoInvitesForUser />}
              <div className={'grid mt-4 divide-y '}>
                {invites.map(invite => <div className={'py-4'} key={invite.id}>
                  <InviteCard invite={invite} />
                </div>)}
              </div>
            </>
          )}
        </Await>
      </Suspense></>
  );
};

export default InvitesPage;