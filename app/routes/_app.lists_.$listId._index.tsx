import { json, LoaderFunctionArgs } from '@remix-run/node';
import { requireRouteParam } from '~/utils/general/request.server';
import { requireAuthentication } from '~/utils/auth/authentication.server';
import { findListWithOwnerById } from '~/models/list.server';
import { requireListOwnership } from '~/utils/list/list.server';
import { useLoaderData } from '@remix-run/react';
import { invariantResponse } from '@epic-web/invariant';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const listId = requireRouteParam('listId', params);
  const user = await requireAuthentication(request);
  const list = await findListWithOwnerById(listId);
  invariantResponse(list, 'List not found');
  requireListOwnership(list, user);
  return json({ list });
};


const ListDetailPage = () => {
  const { list } = useLoaderData<typeof loader>();
  return <p>{list.name}</p>;
};

export default ListDetailPage;