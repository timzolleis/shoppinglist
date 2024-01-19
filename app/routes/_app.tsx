import { Sidebar } from '~/components/ui/sidebar';
import { Outlet } from '@remix-run/react';


const AppLayout = () => {
  return (
    < >
      <Sidebar />
      <div className={'w-full min-h-screen'}>
        <div className={'h-[57px] md:hidden'}></div>
        <div className={'md:pl-[220px] p-5'}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AppLayout;