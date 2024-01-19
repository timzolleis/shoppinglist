import { Tablink, TablinkContainer } from '~/components/ui/tablink';
import { Link, Outlet } from '@remix-run/react';
import { cn } from '~/utils/css/css';
import { buttonVariants } from '~/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '~/components/features/page/page-header';


const ListLayout = () => {
  const { t } = useTranslation('lists');

  return <>
    <PageHeader>{t('listLayout.header')}</PageHeader>
    <div className={'flex justify-end'}>
      <Link to={'new'} className={cn('gap-2', buttonVariants())}>
        <Plus className={'w-4 h-4'} />
        {t('actions.add', { ns: 'common' })}
      </Link>
    </div>
    <TablinkContainer>
      <Tablink to={'/lists'}>{t('listLayout.allLists')}</Tablink>
      <Tablink to={'/lists/deleted'}>{t('listLayout.deletedLists')}</Tablink>
    </TablinkContainer>
    <div className={"mt-4"}>
      <Outlet />
    </div>
  </>;
};

export default ListLayout;
