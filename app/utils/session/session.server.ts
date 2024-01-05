import { createCookie, createCookieSessionStorage } from '@remix-run/node';
import { env } from '~/utils/env/env.server';

// export the whole sessionStorage object
export const sessionCookie = createCookie('_shoppinglist-session', {
  sameSite: 'lax',
  path: '/',
  httpOnly: true,
  secrets: [env.APPLICATION_SECRET],
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 // 24 hours
});


export const sessionStorage = createCookieSessionStorage({
  cookie: sessionCookie
});

export const { getSession, commitSession, destroySession } = sessionStorage;
