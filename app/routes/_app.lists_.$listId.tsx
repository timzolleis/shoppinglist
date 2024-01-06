import { Tablink, TablinkContainer } from '~/components/ui/tablink';
import { useParams } from 'react-router';
import { LIST_LINKS } from '~/links/list';
import { Outlet, useLoaderData } from '@remix-run/react';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { requireRouteParam } from '~/utils/general/request.server';
import { requireAuthentication } from '~/utils/auth/authentication.server';
import { findListWithOwnerById } from '~/models/list.server';
import { invariantResponse } from '@epic-web/invariant';
import { requireListOwnership } from '~/utils/list/list.server';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const listId = requireRouteParam('listId', params);
  const user = await requireAuthentication(request);
  const list = await findListWithOwnerById(listId);
  invariantResponse(list, 'List not found');
  requireListOwnership(list, user);
  return json({ list });
};

const ListDetailLayout = () => {
  const data = useLoaderData<typeof loader>();
  const { listId } = useParams();
  return <>
    <h2 className={'text-2xl font-semibold'}>{data?.list.name}</h2>
    <TablinkContainer>
      <Tablink to={LIST_LINKS.DETAILS(listId)}>Overview</Tablink>
      <Tablink to={LIST_LINKS.SETTINGS(listId)}>Settings</Tablink>
    </TablinkContainer>
    <div>
      <Outlet />
    </div>
  </>;
};
export default ListDetailLayout;