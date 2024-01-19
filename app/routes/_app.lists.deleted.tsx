import { json, LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/utils/auth/authentication.server';
import { findDeletedUserLists, findListById, hardDeleteList, recoverList } from '~/models/list.server';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { NoLists } from '~/components/features/list/no-lists';
import { ListCard } from '~/components/features/list/list-card';
import { Plus } from 'lucide-react';
import { cn } from '~/utils/css/css';
import { buttonVariants } from '~/components/ui/button';
import { getErrorMessage } from '~/utils/error/error.server';
import { listSchemas } from '~/routes/_app.lists._index';
import { NoDeletedLists } from '~/components/features/list/no-deleted-lists';
import { DeletedListCard } from '~/components/features/list/deleted-list-card';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login'
  });
  const lists = await findDeletedUserLists(user.id);
  return json({ lists });
};
export const DELETED_LIST_INTENTS = {
  RECOVER: 'recover',
  DELETE: 'delete'
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login'
  });
  const formData = await request.formData();
  const intent = formData.get('intent')?.toString();
  console.log("INTENT", intent);
  switch (intent) {
    case DELETED_LIST_INTENTS.RECOVER: {
      try {
        const { listId } = listSchemas
          .recover.parse(formData);
        //Check if the list belongs to the user
        const list = await findListById(listId);
        if (list?.ownerId !== user.id) {
          throw new Error('List does not belong to user');
        }
        await recoverList(listId);
        return json({ success: true });
      } catch (e) {
        return json({ success: false, error: getErrorMessage(e) });
      }

    }
    case DELETED_LIST_INTENTS.DELETE: {
      try {
        const { listId } = listSchemas.delete.parse(formData);
        const list = await findListById(listId);
        if (list?.ownerId !== user.id) {
          throw new Error('List does not belong to user');
        }
        console.log("Hard deleting");
        await hardDeleteList(listId);
        return json({ success: true });
      } catch (e) {
        return json({ success: false, error: getErrorMessage(e) });
      }
    }
  }

};


const DeletedListPage = () => {
  const { lists } = useLoaderData<typeof loader>();
  return <>
    {lists.length === 0 && <NoDeletedLists />}
    <div className={'grid gap-2 mt-4'}>
      {lists.map(list => <DeletedListCard list={list} key={list.id} />)}
    </div>
  </>;


};

export default DeletedListPage;
