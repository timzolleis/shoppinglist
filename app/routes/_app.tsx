import { Sidebar } from '~/components/ui/sidebar';
import { Outlet } from '@remix-run/react';


const AppLayout = () => {
  return (
    <main className={"flex items-start"}>
      <Sidebar/>
     <div className={"p-5 w-full"}>
       <Outlet/>
     </div>
    </main>
  )
}

export default AppLayout