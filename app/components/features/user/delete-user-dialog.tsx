import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '~/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Form } from '@remix-run/react';
import { Input } from '~/components/ui/input';


export const DeleteUserDialog = () => {
  const { t } = useTranslation('user');
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={true}>
        <Button variant={'destructive'}>{t('buttons.deleteAccount')}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form method={'post'}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteAccount.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteAccount.confirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input name={'password'} defaultValue={'mypassword'}></Input>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('buttons.cancel')}</AlertDialogCancel>
            <AlertDialogAction>{t('buttons.confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );

};