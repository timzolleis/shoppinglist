import { Link } from '@remix-run/react';
import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/utils/css/css';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { LIST_LINKS } from '~/links/list';

export const NoInvites = () => {
  const { t } = useTranslation('lists');
  const { listId } = useParams();
  return <div className={'rounded-md p-5 text-center'}>
   <span className={'w-full flex justify-center'}>
     <span className={'bg-secondary rounded-full p-3'}>
       <img src={'/assets/no-data.svg'} className={'w-32 h-32'} alt={'empty-state'} />
     </span>
   </span>
    <div className={'mt-4'}>
      <h2 className={'font-semibold text-xl'}>{t('noInvites.header')}</h2>
      <p className={'text-muted-foreground text-sm'}>{t('noInvites.description')}</p>
    </div>
    <div className={'mt-4'}>
      <Link to={LIST_LINKS.INVITES_NEW(listId)}
            className={cn(buttonVariants({ size: 'sm' }), 'gap-2')}>{t('noInvites.inviteMembers')}</Link>
    </div>
  </div>;
};