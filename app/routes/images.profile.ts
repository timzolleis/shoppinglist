import { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/utils/auth/authentication.server';
import { getProfileImage } from '~/utils/supabase/file.server';
import fs from 'fs';
import { findUserById } from '~/models/user.server';


export const loader: LoaderFunction = async ({ request }) => {
  const authenticatedUser = await authenticator.isAuthenticated(request);
  const user = authenticatedUser ? await findUserById(authenticatedUser.id) : null;
  if (!user) {
    throw new Response(null, {
      status: 404
    });
  }
  const headers = {
    'Cache-Control': 'public, max-age=31536000, immutable',
  };
  const imageBuffer = await getProfileImage(user);
  if (!imageBuffer) {
    const fallback = fs.readFileSync('./public/assets/fallback.jpg');
    return new Response(fallback, {
      headers,
    });
  }
  return new Response(imageBuffer, {
    headers,
  });
};