// app/services/auth.server.ts
import { Authenticator } from 'remix-auth';
import { sessionStorage } from '~/utils/session/session.server';
import { User } from '@prisma/client';
import { FormStrategy } from 'remix-auth-form';
import pbkdf2 from 'pbkdf2-passworder';
import { findUserWithPasswordByEmail } from '~/models/user.server';
import { invariant } from '@epic-web/invariant';

export const authenticator = new Authenticator<User>(sessionStorage);

async function verifyPassword(password: string, hash: string) {
  return pbkdf2.compare(password, hash);
}

async function login(email: string, password: string) {
  const user = await findUserWithPasswordByEmail(email);
  if (!user || !user.password) {
    return null;
  }
  const passwordMatch = await verifyPassword(password, user.password.hash);
  if (!passwordMatch) {
    return null;
  }
  return user;
}

const strategy = new FormStrategy(async ({ form }) => {
  const email = form.get('email')?.toString();
  const password = form.get('password')?.toString();
  invariant(email, 'Please provide an email');
  invariant(password, 'Please provide a password');
  const user = await login(email, password);
  invariant(user, 'Invalid email or password');
  return user;
});
authenticator.use(strategy, 'user-pass');
