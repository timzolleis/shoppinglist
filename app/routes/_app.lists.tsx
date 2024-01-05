import { json, LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/utils/auth/authentication.server';
import { findUserLists } from '~/models/list.server';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { NoLists } from '~/components/features/list/no-lists';
import { ListCard } from '~/components/features/list/list-card';
import { Plus } from 'lucide-react';
import { cn } from '~/utils/css/css';
import { buttonVariants } from '~/components/ui/button';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  const lists = await findUserLists(user.id);
  return json({ lists });
};

const ListPage = () => {
  const {lists} = useLoaderData<typeof loader>()
  return <>
    <Outlet/>
    <div className={"flex justify-between"}>
      <h2 className={'text-2xl font-semibold'}>Lists</h2>
      <Link to={'new'} className={cn("gap-2", buttonVariants())}><Plus className={"w-4 h-4"}/>Add</Link>
    </div>
    {lists.length === 0 && <NoLists />}
    <div className={"grid gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mt-4"}>
      {lists.map(list => <ListCard list={list} key={list.id}/>)}
    </div>
  </>


};

export default ListPage;
