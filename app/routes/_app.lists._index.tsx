import { defer, json, LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/utils/auth/authentication.server';
import { deleteList, findListById, findUserLists, getDefaultListId } from '~/models/list.server';
import { Await, useLoaderData } from '@remix-run/react';
import { NoLists } from '~/components/features/list/no-lists';
import { ListCard } from '~/components/features/list/list-card';
import { zfd } from 'zod-form-data';
import { getErrorMessage } from '~/utils/error/error.server';
import { setDefaultList } from '~/models/user.server';
import { Suspense } from 'react';

export const LIST_INTENTS = {
  DELETE: 'delete',
  SET_DEFAULT: 'set-default',
  UNSET_DEFAULT: 'unset-default',
  RECOVER: 'recover'
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login'
  });
  const lists = findUserLists(user.id);
  const defaultListId = await getDefaultListId(user.id);
  return defer({ lists, defaultListId });
};

export const listSchemas = {
  delete: zfd.formData({
    listId: zfd.text()
  }),
  setDefault: zfd.formData({
    listId: zfd.text()
  }),
  recover: zfd.formData({
    listId: zfd.text()
  }),
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login'
  });
  const formData = await request.formData();
  const intent = formData.get('intent')?.toString();
  switch (intent) {
    case LIST_INTENTS.DELETE: {
      try {
        const { listId } = listSchemas.delete.parse(formData);
        //Check if the list belongs to the user
        const list = await findListById(listId);
        if (list?.ownerId !== user.id) {
          throw new Error('List does not belong to user');
        }
        await deleteList(listId);
        return json({ success: true });
      } catch (e) {
        return json({ success: false, error: getErrorMessage(e) });
      }
    }
    case LIST_INTENTS.SET_DEFAULT: {
      try {
        const { listId } = listSchemas.setDefault.parse(formData);
        await setDefaultList({ userId: user.id, listId });
        return json({ success: true });
      } catch (e) {
        return json({ success: false, error: getErrorMessage(e) });
      }
    }
    case LIST_INTENTS.UNSET_DEFAULT: {
      try {
        await setDefaultList({ userId: user.id, listId: null });
        return json({ success: true });
      } catch (e) {
        return json({ success: false, error: getErrorMessage(e) });
      }
    }
  }
  return null;
};


const ListPage = () => {
  const { lists } = useLoaderData<typeof loader>();
  return <>
    <Suspense fallback={<p>Loading list</p>}>
      <Await resolve={lists}>
        {(lists) => (
          <>
            {lists.length === 0 && <NoLists />}
            <div className={'grid gap-2 mt-4'}>
              {lists.map(list => <ListCard list={list} key={list.id} />)}
            </div>
          </>
        )}
      </Await>
    </Suspense>
  </>;


};

export default ListPage;
