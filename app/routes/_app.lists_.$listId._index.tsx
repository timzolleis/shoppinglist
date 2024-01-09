import { defer, LoaderFunctionArgs } from '@remix-run/node';
import { requireRouteParam } from '~/utils/general/request.server';
import { requireAuthentication } from '~/utils/auth/authentication.server';
import { findListAndRequireOwnership } from '~/models/list.server';
import { Await, useLoaderData } from '@remix-run/react';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const listId = requireRouteParam('listId', params);
  const user = await requireAuthentication(request);
  const list = findListAndRequireOwnership(listId, user.id);
  return defer({ list });
};


const ListDetailPage = () => {
  const { list } = useLoaderData<typeof loader>();
  return <Await resolve={list}>
    {list => {
      return <div>
        <h1>{list.name}</h1>
      </div>;
    }}
  </Await>;
};

export default ListDetailPage;