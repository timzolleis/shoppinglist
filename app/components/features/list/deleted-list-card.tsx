import { List } from '@prisma/client';
import { ShoppingBag, Trash, Undo } from 'lucide-react';
import { useSubmit } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { cn } from '~/utils/css/css';
import { LIST_SUBMITS } from '~/utils/submits/list';

export const DeletedListCard = ({list}: {list: List}) => {
  return <div className={"px-5 py-3 rounded-lg border bg-secondary/20 flex items-center justify-between"}>
   <div className={"flex items-center gap-4"}>
     <ShoppingBag className={"text-muted"} size={24}/>
     <p className={"text-sm"}>{list.name}</p>
   </div>
    <DeletedListDropdown list={list}/>
  </div>
}

const DeletedListDropdown = ({list}: {list: List}) => {
  const submit = useSubmit();

  return <div className={"flex items-center divide-x divide-border rounded-md border"}>
    <Button onClick={() => LIST_SUBMITS.RECOVER(submit, list.id)} variant={"ghost"} className={"py-2 px-1 rounded-none"}><Undo className={cn("w-4 h-4 mx-2")}/></Button>
    <Button onClick={() => LIST_SUBMITS.HARD_DELETE(submit, list.id)} variant={"ghost"} className={"py-2 px-1 rounded-none"}><Trash className={"w-4 h-4 mx-2"}/></Button>
  </div>
}