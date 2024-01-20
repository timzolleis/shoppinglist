import {
  AlertDialog,
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
import { PROFILE_INTENTS } from '~/routes/_app.profile';


export const DeleteUserDialog = ({ error }: { error?: string }) => {
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
          <Input name={'password'} className={'my-3'} placeholder={'mypassword'}></Input>
          <p className={'text-destructive text-xs'}>{error}</p>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('buttons.cancel')}</AlertDialogCancel>
            <Button name={'intent'} value={PROFILE_INTENTS.DELETE_ACCOUNT}>
              {t('buttons.deleteAccount')}
            </Button>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );

};