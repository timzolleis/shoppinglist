import { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/utils/auth/authentication.server';
import { getProfileImage } from '~/utils/supabase/file.server';


export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new Response(null, {
      status: 404
    });
  }
  //TODO: Test what happens if this is undefined
  const imageBuffer = await getProfileImage(user);
  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
};