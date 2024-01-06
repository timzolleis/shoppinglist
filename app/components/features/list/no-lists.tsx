import { Plus } from 'lucide-react';
import { Link } from '@remix-run/react';
import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/utils/css/css';
import { useTranslation } from 'react-i18next';

export const NoLists = () => {
  const { t } = useTranslation('lists');
  return <div className={"rounded-md p-5 text-center"}>
   <span className={"w-full flex justify-center"}>
     <span className={"bg-secondary rounded-full p-3"}>
       <img src={"/assets/no-data.svg"} className={"w-32 h-32"} alt={"empty-state"}/>
     </span>
   </span>
    <div className={"mt-4"}>
      <h2 className={"font-semibold text-xl"}>No lists</h2>
      <p className={"text-muted-foreground text-sm"}>You have no lists yet. Create one to get started.</p>
    </div>
    <div className={"mt-4"}>
      <Link to={'/lists/new'} className={cn(buttonVariants({ size: 'sm' }), 'gap-2')}>
        <Plus className={'w-4 h-4'} />
        {t('create_list')}
      </Link>
    </div>
  </div>
}