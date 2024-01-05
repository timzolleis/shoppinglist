import { UserLogout } from '~/components/features/user/user-logout';


export const Sidebar = () => {
  return <div className={"border-r sticky h-screen w-[300px] bg-secondary/30 p-5"}>
    <UserLogout/>
  </div>



}