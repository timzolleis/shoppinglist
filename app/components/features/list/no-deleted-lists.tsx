import { Plus } from 'lucide-react';
import { Link } from '@remix-run/react';
import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/utils/css/css';

export const NoDeletedLists = () => {
  return <div className={"rounded-md p-5 text-center"}>
   <span className={"w-full flex justify-center"}>
     <span className={"bg-secondary rounded-full p-3"}>
       <img src={"/assets/no-data.svg"} className={"w-32 h-32"} alt={"empty-state"}/>
     </span>
   </span>
    <div className={"mt-4"}>
      <h2 className={"font-semibold text-xl"}>No deleted lists</h2>
      <p className={"text-muted-foreground text-sm"}>You didnt delete anything yet! Nice!</p>
    </div>
    <div className={"mt-4"}>
      <Link to={'/lists'} className={cn(buttonVariants({size: "sm"}), "gap-2")}> See my lists</Link>
    </div>
  </div>
}