import { Form, useActionData, useNavigate } from '@remix-run/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useParams } from 'react-router';
import { LIST_LINKS } from '~/links/list';
import { useDefaultOpenDialog } from '~/utils/hooks/use-default-open-dialog';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { requireRouteParam } from '~/utils/general/request.server';
import { requireAuthentication } from '~/utils/auth/authentication.server';
import { findListWithOwnerById } from '~/models/list.server';
import { invariantResponse } from '@epic-web/invariant';
import { requireListOwnership } from '~/utils/list/list.server';
import { inviteSchemas } from '~/routes/_app.lists_.$listId.invites';
import { findUserByEmailAndListId } from '~/models/user.server';
import { createInvite, findInviteByEmailAndListId } from '~/models/list-invites.server';
import { FormErrors, getFormErrors } from '~/utils/error/error.server';
import { z } from 'zod';


//TODO: Translate error messages using fixedT
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const listId = requireRouteParam('listId', params);
  const user = await requireAuthentication(request);
  const list = await findListWithOwnerById(listId);
  invariantResponse(list, 'List not found');
  requireListOwnership(list, user);
  try {
    const { email } = inviteSchemas.create.parse(await request.formData());
    //Check if the user is already a member or invited to the list
    const user = await findUserByEmailAndListId(email, listId);
    if (user) {
      return json({ error: 'User is already a member or invited to the list' });
    }
    const alreadyInvited = await findInviteByEmailAndListId(email, listId);
    if (alreadyInvited) {
      return json({ error: 'User is already a member or invited to the list' });
    }
    await createInvite(email, listId);
    return redirect(LIST_LINKS.INVITES(listId));

  } catch (e) {
    return json({ formErrors: getFormErrors(e) });
  }


};

const CreateInvitePage = () => {
  const { t } = useTranslation('lists');
  const { listId } = useParams();
  const [showDialog] = useDefaultOpenDialog(false);
  const navigate = useNavigate();
  const actionData = useActionData<{
    error?: string,
    formErrors?: FormErrors<z.infer<typeof inviteSchemas.create>>;
  }>();
  return <Dialog open={showDialog} onOpenChange={(open) => {
    if (!open) {
      navigate(LIST_LINKS.INVITES(listId));
    }
  }}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('invites.new.header')}</DialogTitle>
        <DialogDescription>{t('invites.new.description')}</DialogDescription>
      </DialogHeader>
      <Form className={'grid gap-4'} method={'post'}>
        <div className={'grid gap-4'}>
          <Label>{t('invites.new.fields.email.label')}</Label>
          <Input type={'email'} name={'email'} placeholder={t('invites.new.fields.email.placeholder')}></Input>
          <p className={'text-sm text-red-500'}>{actionData?.formErrors?.email || actionData?.error}</p>
        </div>
        <div>
          <Button className={'w-full'}>{t('invites.new.buttons.create')}</Button>
        </div>
      </Form>
    </DialogContent>

  </Dialog>;
};

export default CreateInvitePage;