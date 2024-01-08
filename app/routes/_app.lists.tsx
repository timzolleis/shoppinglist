import { Tablink, TablinkContainer } from '~/components/ui/tablink';
import { Link, Outlet } from '@remix-run/react';
import { cn } from '~/utils/css/css';
import { buttonVariants } from '~/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';


const ListLayout = () => {
  const { t } = useTranslation('lists');

  return <>
    <div className={'flex justify-between'}>
      <h2 className={'text-2xl font-semibold'}>{t('listLayout.header')}</h2>
      <Link to={'new'} className={cn('gap-2', buttonVariants())}>
        <Plus className={'w-4 h-4'} />
        {t('actions.add', { ns: 'common' })}
      </Link>
    </div>
    <TablinkContainer>
      <Tablink to={'/lists'}>{t('listLayout.allLists')}</Tablink>
      <Tablink to={'/lists/deleted'}>{t('listLayout.deletedLists')}</Tablink>
      <Tablink to={'/lists/members'}>{t('listLayout.members')}</Tablink>
    </TablinkContainer>
    <div className={"mt-4"}>
      <Outlet />
    </div>
  </>;
};

export default ListLayout;
