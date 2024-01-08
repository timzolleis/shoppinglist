import { json, LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/utils/auth/authentication.server';
import { findUserLists } from '~/models/list.server';
import { useLoaderData } from '@remix-run/react';
import { NoLists } from '~/components/features/list/no-lists';
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
    <h2 className={'text-2xl font-semibold'}>{t('application.header')}</h2>
    {lists.length === 0 && <NoLists/>}
  </>


};

export default IndexPage;
