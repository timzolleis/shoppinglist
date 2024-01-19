import { ReactNode } from 'react';
import { NavLink } from '@remix-run/react';
import { cn } from '~/utils/css/css';


export const TablinkContainer = ({ children }: { children: ReactNode }) => {
  return <div className={'flex items-center gap-1 overflow-scroll'}>
   {children}
 </div>
}

interface TablinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  overrideIsActive?: boolean;
}

export const Tablink = ({ to, children, className, overrideIsActive }: TablinkProps) => {
  const getIsActive = (isActive: boolean) => overrideIsActive != undefined ? overrideIsActive : isActive;
  return <NavLink end={true}
                  className={({ isActive }) => cn('p-2 px-3.5 leading-none rounded-lg transition-all text-sm font-medium', getIsActive(isActive) && 'bg-secondary', className)}
                  to={to}>{children}</NavLink>;
}