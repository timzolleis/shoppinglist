import { json, LoaderFunctionArgs } from '@remix-run/node';
import { requireRouteParam } from '~/utils/general/request.server';
import { requireAuthentication } from '~/utils/auth/authentication.server';
import { findListWithOwner } from '~/models/list.server';
import { requireListOwnership } from '~/utils/list/list.server';
import { Form, useLoaderData } from '@remix-run/react';
import { invariantResponse } from '@epic-web/invariant';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const listId = requireRouteParam('listId', params);
  const user = await requireAuthentication(request);
  const list = await findListWithOwner(listId);
  invariantResponse(list, 'List not found');
  requireListOwnership(list, user);
  return json({ list });
};


const ListSettingsPage = () => {
  const { list } = useLoaderData<typeof loader>();
  return <div>
    <Form className={'grid gap-4 mt-4'}>
      <div className={'grid gap-2'}>
        <Label htmlFor={'name'}>List name</Label>
        <Input id={'name'} name={'name'} defaultValue={list.name}></Input>
      </div>
      <div className={'grid gap-2'}>
        <Label>Tags</Label>
      </div>
      <div className={'flex justify-start'}>
        <Button>Update list</Button>
      </div>
    </Form>


  </div>;
};

export default ListSettingsPage;