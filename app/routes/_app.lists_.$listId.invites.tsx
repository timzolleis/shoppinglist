import { json, LoaderFunctionArgs } from '@remix-run/node';
import { requireRouteParam } from '~/utils/general/request.server';
import { requireAuthentication } from '~/utils/auth/authentication.server';
import { findListWithOwnerById } from '~/models/list.server';
import { requireListOwnership } from '~/utils/list/list.server';
import { Outlet, useLoaderData } from '@remix-run/react';
import { invariantResponse } from '@epic-web/invariant';
import { findInvitesForList } from '~/models/list-invites.server';
import { NoInvites } from '~/components/features/list-invites/no-invites';
import { zfd } from 'zod-form-data';
import { z } from 'zod';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const listId = requireRouteParam('listId', params);
  const user = await requireAuthentication(request);
  const list = await findListWithOwnerById(listId);
  invariantResponse(list, 'List not found');
  requireListOwnership(list, user);
  //Find all members of the list
  const invites = await findInvitesForList(listId);
  return json({ list, invites });

};

export const inviteSchemas = {
  create: zfd.formData({
    email: zfd.text(z.string().email())
  })
};


const ListMembersPage = () => {
  const { list, invites } = useLoaderData<typeof loader>();
  return <div>
    <Outlet />
    {invites.length === 0 && <NoInvites />}
  </div>;
};

export default ListMembersPage;