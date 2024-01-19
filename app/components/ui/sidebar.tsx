import { UserLogout } from '~/components/features/user/user-logout';
import { ReactNode } from 'react';
import { NavLink } from '@remix-run/react';
import { Home, ListOrdered, Send } from 'lucide-react';
import { cn } from '~/utils/css/css';
import { useTranslation } from 'react-i18next';


export const Sidebar = () => {
  const { t } = useTranslation('navigation');

  return <div
    className={'md:border-r fixed bottom-0 h-[57px] flex items-center md:block border-t w-full px-5 py-3 md:p-5 md:top-0 mt-[57px] md:h-[calc(100vh-57px)] md:w-[200px]'}>
   <div className={"hidden md:block"}>
     <UserLogout/>
   </div>
    <div className={'flex items-center md:block justify-around w-full md:mt-5'}>
      <SidebarNavItem icon={<Home className={'w-6 h-6 md:w-4 md:h-4'} />} text={t('sidebar.home')}
                      url={'/'} />
      <SidebarNavItem icon={<ListOrdered className={'w-6 h-6 md:w-4 md:h-4'} />} text={t('sidebar.myLists')}
                      url={'/lists'} />
      <SidebarNavItem icon={<Send className={'w-6 h-6 md:w-4 md:h-4'} />} text={t('sidebar.invitations')}
                      url={'/invites'} />
    </div>
  </div>
}

export const SidebarNavItem = ({icon, text, url}: {icon: ReactNode, text: string, url: string}) => {
  return <NavLink to={url}
                  className={({ isActive }) => cn('flex flex-col md:flex-row md:hover:bg-secondary md:px-5 md:py-2 md:rounded-md gap-1 md:gap-2 items-center md:justify-start md:w-full', isActive ? 'text-secondary-foreground' : 'text-muted-foreground')}>
    {icon}
    <p className={'text-xs hidden md:block md:text-sm'}>{text}</p>
  </NavLink>

}