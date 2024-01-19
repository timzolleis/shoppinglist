import { ShoppingBasket } from 'lucide-react';

interface PageHeaderProps {
  children: string;
}

export const PageHeader = ({ children }: PageHeaderProps) => {
  return <div
    className={'top-0 left-0 fixed md:hidden z-[100] w-full bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800'}>
    <div className={'w-full h-[57px] flex items-center justify-between gap-4 p-3 max-w-none mx-auto'}>
      <div>
        <ShoppingBasket />
      </div>
      <div>
        <h2 className={' font-medium text-center'}>{children}</h2>
      </div>
      <div>
        <div className={'w-6 h-6 bg-blue-500 rounded-full'}></div>
      </div>

    </div>
  </div>;
};