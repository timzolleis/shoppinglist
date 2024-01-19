import { json, LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/utils/auth/authentication.server';
import { findUserLists } from '~/models/list.server';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  const lists = await findUserLists(user.id);
  return json({ lists });
};

const IndexPage = () => {
  const { t } = useTranslation('common');

  const {lists} = useLoaderData<typeof loader>()
  return <>
    <p>Startseite hier</p>
  </>


};

export default IndexPage;
