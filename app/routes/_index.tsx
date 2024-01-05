import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/utils/auth/authentication.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  return null;
};

const IndexPage = () => {
  return <p>This is a protected page!</p>;
};

export default IndexPage;
