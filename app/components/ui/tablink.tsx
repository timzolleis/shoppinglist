import { ReactNode } from 'react';
import { NavLink } from '@remix-run/react';
import { cn } from '~/utils/css/css';


export const TablinkContainer = ({ children }: { children: ReactNode }) => {
  return <div className={'flex items-center gap-2 border-b overflow-scroll'}>
   {children}
 </div>
}

interface TablinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}
export const Tablink = ({to, children, className}: TablinkProps) => {
  return <NavLink end={true} className={({isActive}) => cn("text-sm py-2 px-3", isActive && "border-b-2 border-primary", className)} to={to}>{children}</NavLink>
}