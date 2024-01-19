import { useOptionalUser } from '~/utils/hooks/use-optional-user';
import { ChevronDown, ChevronRight, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { Form } from '@remix-run/react';

export const UserLogout = () => {
  const user = useOptionalUser();
  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="flex items-center gap-2 text-sm">
        <User className={"bg-secondary p-1 w-8 h-8 rounded-full"} />
        <p> {user?.name}</p>
        <ChevronDown className={'text-secondary-foreground w-4 h-4'} />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="start" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{user?.name}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user?.email}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild={true}>
      <Form method={"post"} action={"/logout"}>
        <button className={"w-full text-left"}>Logout</button>
      </Form>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;


};