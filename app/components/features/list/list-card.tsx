import { List } from '@prisma/client';
import { ShoppingBag, Star, Trash } from 'lucide-react';
import { Link, useLoaderData, useSubmit } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { cn } from '~/utils/css/css';
import { LIST_SUBMITS } from '~/utils/submits/list';

export const ListCard = ({list}: {list: List}) => {
  return <div className={"px-5 py-3 rounded-lg border bg-secondary/20 flex items-center justify-between"}>
    <Link to={`/lists/${list.id}`} className={'flex items-center gap-4'}>
     <ShoppingBag className={"text-muted"} size={24}/>
     <p className={"text-sm"}>{list.name}</p>
    </Link>
    <ListDropDown list={list}/>
  </div>
}

const ListDropDown = ({list}: {list: List}) => {
  const loaderData = useLoaderData<{defaultListId?: string}>();
  const submit = useSubmit();
  const isDefaulted = loaderData.defaultListId === list.id
  return <div className={"flex items-center divide-x divide-border rounded-md border"}>
    <Button onClick={() => {
      if (isDefaulted){
        LIST_SUBMITS.UNSET_DEFAULT(submit)
      }
      else {
        LIST_SUBMITS.SET_DEFAULT(submit, list.id)
      }

    }} variant={"ghost"} className={"py-2 px-1 rounded-none"}><Star className={cn("w-4 h-4 mx-2",  isDefaulted && "fill-primary")}/></Button>
    <Button onClick={() => LIST_SUBMITS.DELETE(submit, list.id)} variant={"ghost"} className={"py-2 px-1 rounded-none"}><Trash className={"w-4 h-4 mx-2"}/></Button>
  </div>
}