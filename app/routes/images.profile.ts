import { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/utils/auth/authentication.server';
import fs from 'fs';


export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new Response(null, {
      status: 404
    });
  }
  //Load a static image
  const image = fs.readdirSync('./public').filter((file) => file.endsWith('.jpg'))?.[0];
  if (!image) {
    throw new Response(null, {
      status: 404
    });
  }
  const imageBuffer = fs.readFileSync(`./public/${image}`);
  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=120'
    }
  });
};