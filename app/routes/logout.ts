import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { authenticator } from '~/utils/auth/authentication.server';
import { destroySession, getSession } from '~/utils/session/session.server';


export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.logout(request, {
    redirectTo: '/login',
  })

}