import { UserLogout } from '~/components/features/user/user-logout';
import { ReactNode } from 'react';
import { Link, NavLink } from '@remix-run/react';
import { ClipboardList, ListIcon } from 'lucide-react';
import { cn } from '~/utils/css/css';


export const Sidebar = () => {
  return <div className={"border-r fixed bottom-0 border-t w-full bg-secondary/30 px-5 py-3 md:p-5 md:top-0 md:h-screen md:w-[200px]"}>
   <div className={"hidden md:block"}>
     <UserLogout/>
   </div>
    <div className={"flex items-center gap-2 md:mt-5"}>
<SidebarNavItem icon={<ClipboardList className={"w-6 h-6 md:w-4 md:h-4"}/>} text={"My Lists"} url={"/lists"}/>
    </div>
  </div>
}

export const SidebarNavItem = ({icon, text, url}: {icon: ReactNode, text: string, url: string}) => {
  return <NavLink end={true} to={url} className={({isActive}) => cn("flex flex-col md:flex-row md:hover:bg-secondary md:px-5 md:py-2 md:rounded-md gap-1 md:gap-2 items-center md:justify-start md:w-full", isActive ? "text-muted-foreground" : "text-muted-foreground/50")}>
    {icon}
    <p className={"text-xs"}>{text}</p>
  </NavLink>

}