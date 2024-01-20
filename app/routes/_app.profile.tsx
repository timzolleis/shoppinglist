import { ActionFunctionArgs, json } from '@remix-run/node';
import { authenticator, requireAuthentication, verifyPassword } from '~/utils/auth/authentication.server';
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
import { getFormErrors } from '~/utils/error/error.server';
import i18next from '~/i18next.server';
import { TFunction } from 'i18next';
import { deleteUser, findPasswordByUserId, updateUser } from '~/models/user.server';
import { jsonWithSuccess } from 'remix-toast';
import { commitSession, getSession } from '~/utils/session/session.server';
import { DeleteUserDialog } from '~/components/features/user/delete-user-dialog';
import pbkdf2 from 'pbkdf2-passworder';


export const loader = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  invariantResponse(user, 'User not found');
  return json({ user });
};


export const PROFILE_INTENTS = {
  UPDATE: 'update',
  CHANGE_PASSWORD: 'changePassword',
  DELETE_ACCOUNT: 'deleteAccount'
};

type UpdateUserSchema = z.infer<ReturnType<typeof updateUserSchema>>;

const updateUserSchema = (translation: TFunction<'errors', undefined>) => zfd.formData({
  name: zfd.text(z.string({ required_error: translation('field.required', { field: 'name' }) }).min(3)),
  email: zfd.text(z.string({ required_error: translation('field.required', { field: 'email' }) }).email({
    message: (translation('field.wrongType', {
      field: 'email',
      type: 'email'
    }))
  }))
});

type DeleteUserSchema = z.infer<ReturnType<typeof deleteUserSchema>>;
const deleteUserSchema = (translation: TFunction<'errors', undefined>) => zfd.formData({
  password: zfd.text(z.string({ required_error: translation('field.required', { field: 'password' }) }).min(3))
});

type ChangePasswordSchema = z.infer<ReturnType<typeof changePasswordSchema>>;
const changePasswordSchema = (translation: TFunction<'errors', undefined>) => zfd.formData({
  password: zfd.text(z.string({ required_error: translation('changePassword.passwordMissing') }).min(3)),
  passwordConfirmation: zfd.text(z.string({ required_error: translation('changePassword.confirmationMissing') }).min(3))
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
    case PROFILE_INTENTS.CHANGE_PASSWORD: {
      try {
        const { password, passwordConfirmation } = changePasswordSchema(errorTranslation).parse(formData);
        if (password !== passwordConfirmation) {
          return json({ formErrors: { passwordConfirmation: errorTranslation('changePassword.mismatch') } });
        }
        const hash = await pbkdf2.hash(password);
        //Update the user
        await updateUser(user.id, {
          password: {
            update: {
              data: {
                hash
              }
            }
          }
        });
        return jsonWithSuccess(null, userTranslation('toasts.updated'));
      } catch (e) {
        return json({ formErrors: getFormErrors(e) });
      }
    }
    case PROFILE_INTENTS.DELETE_ACCOUNT: {
      try {
        const password = deleteUserSchema(errorTranslation).parse(formData).password;
        const userPassword = await findPasswordByUserId(user.id);
        if (!userPassword) {
          return json({ formErrors: { password: errorTranslation('field.required', { field: 'password' }) } });
        }
        //Check if the password is correct
        const matches = await verifyPassword(password, userPassword.hash);
        if (!matches) {
          return json({ formErrors: { password: errorTranslation('deleteAccount.wrongPassword') } });
        }
        //Delete the user
        await deleteUser(user.id);
        //Delete the session
        return await authenticator.logout(request, {
          redirectTo: '/login'
        });
      } catch (e) {
        return json({ formErrors: getFormErrors(e) });
      }
    }
    default: {
      return null;
    }
  }
};


type Combine<T1, T2, T3> = {
  [K in keyof T1]: T1[K]
} & {
  [K in keyof T2]: T2[K]
} & {
  [K in keyof T3]: T3[K]
}

const ProfilePage = () => {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<{
    formErrors: Combine<UpdateUserSchema, DeleteUserSchema, ChangePasswordSchema>,
  }>();
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
          <p className={'text-xs text-destructive'}>{actionData?.formErrors?.name}</p>
        </div>
        <div className={'space-y-3'}>
          <Label>{t('fields.email')}</Label>
          <Input defaultValue={user.email} name={'email'} />
          <p className={'text-xs text-destructive'}>{actionData?.formErrors.email}</p>
        </div>
        <Button>{t('buttons.update')}</Button>
      </Form>
      <Separator className={'my-10'}></Separator>
      <h2 className={'text-xl font-medium'}>{t('security.title')}</h2>
      <p className={'text-sm text-muted-foreground'}>{t('security.description')}</p>
      <Form className={'space-y-4 mt-4'} method={'post'}>
        <input type={'hidden'} name={'intent'} value={PROFILE_INTENTS.CHANGE_PASSWORD} />
        <div className={'space-y-3'}>
          <Label>{t('fields.password')}</Label>
          <Input type={'password'} name={'password'} />
          <p className={'text-xs text-destructive'}>{actionData?.formErrors?.password}</p>
        </div>
        <div className={'space-y-3'}>
          <Label>{t('fields.passwordConfirmation')}</Label>
          <Input type={'password'} name={'passwordConfirmation'} />
          <p className={'text-xs text-destructive'}>{actionData?.formErrors?.passwordConfirmation}</p>
        </div>
        <Button>{t('buttons.changePassword')}</Button>
      </Form>
      <Separator className={'my-10'}></Separator>

      <h2 className={'text-xl font-medium'}>{t('deleteAccount.title')}</h2>
      <p className={'text-sm text-muted-foreground'}>{t('deleteAccount.description')}</p>
      <div className={'mt-4'}>
        <DeleteUserDialog error={actionData?.formErrors?.password} />
      </div>
    </>
  );
};

export default ProfilePage;