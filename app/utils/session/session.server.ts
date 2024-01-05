import { createCookieSessionStorage } from '@remix-run/node';
import { env } from '~/utils/env/env.server';

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_shoppinglist-session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [env.APPLICATION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
