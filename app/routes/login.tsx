import { Form, Link, useActionData } from '@remix-run/react';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { ActionFunctionArgs, json } from '@remix-run/node';
import { ShoppingBag } from 'lucide-react';
import { authenticator } from '~/utils/auth/authentication.server';
import { AuthorizationError } from 'remix-auth';
import { useIsLoading } from '~/utils/hooks/use-is-loading';

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
  return (
    <>
      <div className='p-8 flex h-screen items-center'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <span className={'w-full flex justify-center'}>
              <ShoppingBag size={48} />
            </span>
            <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
          </div>
          <div>
            <Form method={'post'}>
              <div className='grid gap-2'>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    name={'email'}
                    id='email'
                    placeholder='name@example.com'
                    type='email'
                    autoCapitalize='none'
                    autoComplete='email'
                    autoCorrect='off'
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    name={'password'}
                    id='password'
                    placeholder='examplepassword'
                    type='password'
                    autoComplete={'off'}
                  />
                </div>
                <Button isLoading={isLoading}>Sign In</Button>
                <span className={'text-sm text-muted-foreground text-center'}>
                  Do not have an account?{' '}
                  <Link className={'font-medium underline'} to={'/register'}>
                    Register here
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

export default LoginPage;
