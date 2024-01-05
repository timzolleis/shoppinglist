import { Form, Link, useActionData } from '@remix-run/react';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { zfd } from 'zod-form-data';
import { FormErrors, getFormErrors } from '~/utils/error/error.server';
import { z } from 'zod';
import { ShoppingBag } from 'lucide-react';
import { createUser } from '~/models/user.server';

const registerSchema = zfd.formData({
  name: zfd.text(z.string({ required_error: 'Please enter your name' })),
  email: zfd.text(z.string({ required_error: 'Please enter your email' })),
  password: zfd.text(z.string({ required_error: 'Please enter your password' })),
  confirmPassword: zfd.text(z.string({ required_error: 'Please confirm your password' })),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { email, password, name, confirmPassword } = registerSchema.parse(
      await request.formData(),
    );
    if (password !== confirmPassword) {
      return json({
        formErrors: { confirmPassword: 'Passwords do not match' },
      });
    }
    //Create the user
    await createUser({ email, password, name });
    return redirect('/login');
  } catch (e) {
    return json({ formErrors: getFormErrors(e) });
  }
};

const LoginPage = () => {
  const actionData = useActionData<{
    formErrors?: FormErrors<z.infer<typeof registerSchema>>;
  }>();
  return (
    <>
      <div className='p-8 flex h-screen items-center'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <span className={'w-full flex justify-center'}>
              <ShoppingBag size={48} />
            </span>
            <h1 className='text-2xl font-semibold tracking-tight'>Create an account</h1>
          </div>
          <div>
            <Form method={'post'}>
              <div className='grid gap-2'>
                <div className='grid gap-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    name={'name'}
                    id='name'
                    placeholder='John Doe'
                    type='text'
                    autoCapitalize='none'
                    autoCorrect='off'
                  />
                  <p className={'text-destructive'}>{actionData?.formErrors?.name}</p>
                </div>
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
                  <p className={'text-destructive'}>{actionData?.formErrors?.email}</p>
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
                  <p className={'text-red-500 font-medium text-sm'}>
                    {actionData?.formErrors?.password}
                  </p>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='confirmPassword'>Confirm password</Label>
                  <Input
                    name={'confirmPassword'}
                    id='confirmPassword'
                    placeholder='examplepassword'
                    type='password'
                    autoComplete={'off'}
                  />
                  <p className={'text-red-500 font-medium text-sm'}>
                    {actionData?.formErrors?.confirmPassword}
                  </p>
                </div>
                <Button>Create account</Button>
                <span className={'text-sm text-muted-foreground text-center'}>
                  Already have an account?{' '}
                  <Link className={'font-medium underline'} to={'/login'}>
                    Login here
                  </Link>
                </span>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
