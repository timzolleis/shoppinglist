import { Sidebar } from '~/components/ui/sidebar';
import { Outlet } from '@remix-run/react';
import { MaxWidth } from '~/components/ui/max-width';


const AppLayout = () => {
  return (
    < >
      <Sidebar />
      <div className={'w-full min-h-screen'}>
        <div className={'h-[57px]'}></div>
        <div className={'md:pl-[220px] p-5'}>
          <MaxWidth>
          <Outlet />
          </MaxWidth>
        </div>
      </div>
    </>
  );
};

export default AppLayout;