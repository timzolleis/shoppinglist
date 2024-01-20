import { ActionFunctionArgs, json } from '@remix-run/node';
import { authenticator, requireAuthentication } from '~/utils/auth/authentication.server';
import { invariantResponse } from '@epic-web/invariant';
import { PageHeader } from '~/components/features/page/page-header';
import { useTranslation } from 'react-i18next';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { FormErrors, getFormErrors } from '~/utils/error/error.server';
import i18next from '~/i18next.server';
import { TFunction } from 'i18next';
import { updateUser } from '~/models/user.server';
import { jsonWithSuccess } from 'remix-toast';
import { commitSession, getSession } from '~/utils/session/session.server';
import { DeleteUserDialog } from '~/components/features/user/delete-user-dialog';


export const loader = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  invariantResponse(user, 'User not found');
  return json({ user });
};


const PROFILE_INTENTS = {
  UPDATE: 'update',
  DELETE_ACCOUNT: 'deleteAccount'
};

const updateUserSchema = (translation: TFunction<'errors', undefined>) => zfd.formData({
  name: zfd.text(z.string({ required_error: translation('field.required', { field: 'name' }) }).min(3)),
  email: zfd.text(z.string({ required_error: translation('field.required', { field: 'email' }) }).email({
    message: (translation('field.wrongType', {
      field: 'email',
      type: 'email'
    }))
  }))
});
export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireAuthentication(request);
  const formData = await request.formData();
  const errorTranslation = await i18next.getFixedT(request, 'errors');
  const userTranslation = await i18next.getFixedT(request, 'user');
  const intent = formData.get('intent');
  switch (intent) {
    case PROFILE_INTENTS.UPDATE: {
      try {
        const data = updateUserSchema(errorTranslation).parse(formData);
        //Update the user
        const updated = await updateUser(user.id, data);
        //Update the session
        const session = await getSession(request);
        session.set('user', updated);
        return jsonWithSuccess(null, userTranslation('toasts.updated'), {
          headers: {
            'Set-Cookie': await commitSession(session)
          }
        });
      } catch (e) {
        return json({ formErrors: getFormErrors(e) });
      }
    }
    case PROFILE_INTENTS.DELETE_ACCOUNT: {
      console.log('delete account');
      break;
    }
    default: {
      return null;
    }
  }
};


const ProfilePage = () => {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<{ formErrors: FormErrors<z.infer<ReturnType<typeof updateUserSchema>>> }>();
  const { t } = useTranslation('user');
  return (
    <>
      <PageHeader>{t('profile.title')}</PageHeader>
      <h2 className={'text-xl font-medium'}>{t('profile.title')}</h2>
      <p className={'text-sm text-muted-foreground'}>{t('profile.description')}</p>
      <Form className={'space-y-4 mt-4'} method={'post'}>
        <input type={'hidden'} name={'intent'} value={PROFILE_INTENTS.UPDATE} />
        <div className={'space-y-3'}>
          <Label>{t('fields.name')}</Label>
          <Input defaultValue={user.name} name={'name'} />
          <p className={'text-xs text-destructive'}>{actionData?.formErrors.name}</p>
        </div>
        <div className={'space-y-3'}>
          <Label>{t('fields.email')}</Label>
          <Input defaultValue={user.email} name={'email'} />
          <p className={'text-xs text-destructive'}>{actionData?.formErrors.email}</p>
        </div>
        <Button>{t('buttons.update')}</Button>
      </Form>
      <Separator className={'my-10'}></Separator>
      <h2 className={'text-xl font-medium'}>{t('deleteAccount.title')}</h2>
      <p className={'text-sm text-muted-foreground'}>{t('deleteAccount.description')}</p>
      <div className={'mt-4'}>
        <DeleteUserDialog />
      </div>
    </>
  );
};

export default ProfilePage;