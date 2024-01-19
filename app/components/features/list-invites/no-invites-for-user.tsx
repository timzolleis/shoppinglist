import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

export const NoInvitesForUser = () => {
  const { t } = useTranslation('lists');
  const { listId } = useParams();
  return <div className={'rounded-md p-5 text-center'}>
   <span className={'w-full flex justify-center'}>
     <span className={'bg-secondary rounded-full p-3'}>
       <img src={'/assets/no-data.svg'} className={'w-32 h-32'} alt={'empty-state'} />
     </span>
   </span>
    <div className={'mt-4'}>
      <h2 className={'font-semibold text-xl'}>{t('noInvitesUser.header')}</h2>
      <p className={'text-muted-foreground text-sm'}>{t('noInvitesUser.description')}</p>
    </div>
  </div>;
};