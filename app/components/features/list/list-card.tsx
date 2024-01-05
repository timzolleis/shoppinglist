import { List } from '@prisma/client';
import { ShoppingBag } from 'lucide-react';

export const ListCard = ({list}: {list: List}) => {
  return <div className={"px-5 py-3 rounded-lg border bg-secondary/20 flex md:block items-center gap-4"}>
    <ShoppingBag className={"text-muted"} size={32}/>
    <p className={"md:mt-4 font-medium md:text-sm"}>{list.name}</p>
  </div>



}