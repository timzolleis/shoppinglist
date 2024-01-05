import { Sidebar } from '~/components/ui/sidebar';
import { Outlet } from '@remix-run/react';


const AppLayout = () => {
  return (
    < >
      <Sidebar />
      <div className={'p-5 w-full'}>
        <div className={'md:pl-[200px]'}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AppLayout;