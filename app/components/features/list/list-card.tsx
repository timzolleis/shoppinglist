import { List } from '@prisma/client';
import { ExternalLink, ShoppingBag, Trash } from 'lucide-react';
import { Link, useSubmit } from '@remix-run/react';
import { Button, buttonVariants } from '~/components/ui/button';
import { cn } from '~/utils/css/css';
import { LIST_SUBMITS } from '~/utils/submits/list';

export const ListCard = ({list}: {list: List}) => {
  return <div className={"px-5 py-3 rounded-lg border bg-secondary/20 flex items-center justify-between"}>
   <div className={"flex items-center gap-4"}>
     <ShoppingBag className={"text-muted"} size={24}/>
     <p className={"text-sm"}>{list.name}</p>
   </div>
    <ListDropDown list={list}/>
  </div>
}

const ListDropDown = ({list}: {list: List}) => {
  const submit = useSubmit();
  return <div className={"flex items-center divide-x divide-border rounded-md border"}>
    <Link className={cn(buttonVariants({variant: "ghost"}), "py-2 px-1 rounded-none")} to={`/lists/${list.id}`}><ExternalLink className={"w-4 mx-2 h-4"}/></Link>
    <Button onClick={() => LIST_SUBMITS.DELETE(submit, list.id)} variant={"ghost"} className={"py-2 px-1 rounded-none"}><Trash className={"w-4 h-4 mx-2"}/></Button>
  </div>
}