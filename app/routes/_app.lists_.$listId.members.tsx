import { json, LoaderFunctionArgs } from '@remix-run/node';
import { requireRouteParam } from '~/utils/general/request.server';
import { requireAuthentication } from '~/utils/auth/authentication.server';
import { findListMembers, findListWithOwnerById } from '~/models/list.server';
import { requireListOwnership } from '~/utils/list/list.server';
import { useLoaderData } from '@remix-run/react';
import { invariantResponse } from '@epic-web/invariant';
import { NoMembers } from '~/components/features/list-members/no-members';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const listId = requireRouteParam('listId', params);
  const user = await requireAuthentication(request);
  const list = await findListWithOwnerById(listId);
  invariantResponse(list, 'List not found');
  requireListOwnership(list, user);
  //Find all members of the list
  const members = await findListMembers(listId);
  return json({ list, members });

};

const ListMembersPage = () => {
  const { list, members } = useLoaderData<typeof loader>();
  return <div>
    {members.length === 0 && <NoMembers />}
  </div>;
};

export default ListMembersPage;