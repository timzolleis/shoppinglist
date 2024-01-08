import { Form, isRouteErrorResponse, Link, useActionData, useRouteError } from '@remix-run/react';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { ActionFunctionArgs, json } from '@remix-run/node';
import { ShoppingBag } from 'lucide-react';
import { authenticator } from '~/utils/auth/authentication.server';
import { AuthorizationError } from 'remix-auth';
import { useIsLoading } from '~/utils/hooks/use-is-loading';
import { useTranslation } from 'react-i18next';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    await authenticator.authenticate('user-pass', request, {
      successRedirect: '/',
      throwOnError: true,
    });
  } catch (e) {
    if (e instanceof Response) return e;
    if (e instanceof AuthorizationError) {
      return json({ error: e.message });
    }
    return json({
      error: 'An unknown error occurred. Please try again later.',
    });
  }
};

const LoginPage = () => {
  const actionData = useActionData<{ error?: string }>();
  const isLoading = useIsLoading();
  const { t } = useTranslation('authentication');
  return (
    <>
      <div className='p-8 flex h-screen items-center'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <span className={'w-full flex justify-center'}>
              <ShoppingBag size={48} />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight">{t('login.header')}</h1>
          </div>
          <div>
            <Form method={'post'}>
              <div className='grid gap-2'>
                <div className='grid gap-2'>
                  <Label htmlFor="email">{t('login.fields.email.label')}</Label>
                  <Input
                    name={'email'}
                    id='email'
                    placeholder={t('login.fields.email.placeholder')}
                    type='email'
                    autoCapitalize='none'
                    autoComplete='email'
                    autoCorrect='off'
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor="password">{t('login.fields.password.label')}</Label>
                  <Input
                    name={'password'}
                    id='password'
                    placeholder={t('login.fields.password.placeholder')}
                    type='password'
                    autoComplete={'off'}
                  />
                </div>
                <Button isLoading={isLoading}>{t('login.buttons.signIn')}</Button>
                <span className={'text-sm text-muted-foreground text-center'}>
                 {t('login.footer.noAccount')} {' '}
                  <Link className={'font-medium underline'} to={'/register'}>
                    {t('login.footer.register')}
                  </Link>
                </span>
              </div>
              <p className={'text-red-500 font-medium text-sm mt-2 text-center'}>
                {actionData?.error}
              </p>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};


export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
export default LoginPage;
