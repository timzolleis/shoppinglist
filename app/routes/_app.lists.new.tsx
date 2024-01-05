import { useEffect, useLayoutEffect, useState } from 'react';
import { ResponsiveDialog } from '~/components/ui/responsive-dialog';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Form, useActionData, useNavigate } from '@remix-run/react';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { zfd } from 'zod-form-data';
import { set, z } from 'zod';
import { authenticator } from '~/utils/auth/authentication.server';
import { createList } from '~/models/list.server';
import { FormErrors, getFormErrors } from '~/utils/error/error.server';
import { useIsLoading } from '~/utils/hooks/use-is-loading';
import { ClientOnly } from 'remix-utils/client-only';
import { logger } from '@remix-pwa/sw';

const addListSchema = zfd.formData({
  name: zfd.text(z.string({ required_error: 'Please provide a name for your list' }))
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login'
  });
  try {
    const { name } = addListSchema.parse(await request.formData());
    const list = await createList(name, user.id);
    return redirect(`/lists/${list.id}`);
  } catch (e) {
    return json({ formErrors: getFormErrors(e) });
  }
};


const NewListPage = () => {
  const [showDialog] = useState(true);
  const navigate = useNavigate();
  const actionData = useActionData<{ formErrors?: FormErrors<z.infer<typeof addListSchema>> }>();
  const isLoading = useIsLoading('name');
  return (
    <>
        <ResponsiveDialog open={showDialog} onClose={(value) =>  !value && navigate('/lists')}
                                 title={'Create List'}
                                 description={'Create a new list to get started.'}
        >
          <Form className={'grid items-start gap-4'} method={'post'}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input type="text" name={'name'} id="name" placeholder="Weekly shopping" />
              <p className={'text-sm text-red-500'}>{actionData?.formErrors?.name}</p>
            </div>
            <Button isLoading={isLoading} type="submit">Create list</Button>
          </Form>
        </ResponsiveDialog>
    </>
  );
};

export default NewListPage;