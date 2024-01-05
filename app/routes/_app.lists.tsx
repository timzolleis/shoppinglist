import { Tablink, TablinkContainer } from '~/components/ui/tablink';
import { Link, Outlet } from '@remix-run/react';
import { cn } from '~/utils/css/css';
import { buttonVariants } from '~/components/ui/button';
import { Plus } from 'lucide-react';


const ListLayout = () => {
  return <>
    <div className={'flex justify-between'}>
      <h2 className={'text-2xl font-semibold'}>Lists</h2>
      <Link to={'new'} className={cn('gap-2', buttonVariants())}><Plus className={'w-4 h-4'} />Add</Link>
    </div>
    <TablinkContainer>
      <Tablink to={'/lists'}>All Lists</Tablink>
      <Tablink to={'/lists/deleted'}>Deleted Lists</Tablink>
    </TablinkContainer>
    <div className={"mt-4"}>
      <Outlet />
    </div>
  </>;
};

export default ListLayout;
