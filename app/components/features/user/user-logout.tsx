import { useOptionalUser } from '~/utils/hooks/use-optional-user';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { Form, Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarImage } from '~/components/ui/avatar';

export const UserLogout = () => {
  const user = useOptionalUser();
  const { t } = useTranslation('navigation');
  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="flex items-center gap-2 text-sm">
        <Avatar className={'w-6 h-6'}>
          <AvatarImage src="/images/profile" />
        </Avatar>
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
        <button className={'w-full text-left'}>{t('userMenu.logout')}</button>
      </Form>
      </DropdownMenuItem>
      <DropdownMenuItem asChild={true}>
        <Link to={'/profile'}>{t('userMenu.profile')}</Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;


};