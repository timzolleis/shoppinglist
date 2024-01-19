import { Tablink, TablinkContainer } from '~/components/ui/tablink';
import { useParams } from 'react-router';
import { LIST_LINKS } from '~/links/list';
import { Await, Outlet, useLoaderData } from '@remix-run/react';
import { defer, LoaderFunctionArgs } from '@remix-run/node';
import { requireRouteParam } from '~/utils/general/request.server';
import { requireAuthentication } from '~/utils/auth/authentication.server';
import { findListAndRequireOwnership } from '~/models/list.server';
import { useTranslation } from 'react-i18next';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const listId = requireRouteParam('listId', params);
  const user = await requireAuthentication(request);
  const list = findListAndRequireOwnership(listId, user.id);
  return defer({ list });
};

const ListDetailLayout = () => {
  const data = useLoaderData<typeof loader>();
  const { listId } = useParams();
  const { t } = useTranslation('lists');
  return <>
    <Await resolve={data.list}>
      {list => {
        return <h2 className={'text-2xl font-semibold'}>{list.name}</h2>;
      }}
    </Await>
    <TablinkContainer>
      <Tablink to={LIST_LINKS.DETAILS(listId)}>{t('listDetailsLayout.overview')}</Tablink>
      <Tablink to={LIST_LINKS.SETTINGS(listId)}>{t('listDetailsLayout.settings')}</Tablink>
      <Tablink to={LIST_LINKS.MEMBERS(listId)}>{t('listDetailsLayout.members')}</Tablink>
    </TablinkContainer>
    <div>
      <Outlet />
    </div>
  </>;
};
export default ListDetailLayout;