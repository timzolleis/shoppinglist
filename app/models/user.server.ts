import { User } from '@prisma/client';
import { prisma } from '~/utils/db/prisma.server';
import pbkdf2 from 'pbkdf2-passworder';
import { getNowAsISO } from '~/utils/date/date';

export async function findUserWithPasswordByEmail(email: User['email']) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });
}

export async function createUser({
  name,
  email,
  password,
}: {
  name: User['name'];
  email: User['email'];
  password: string;
}) {
  const hash = await pbkdf2.hash(password);
  return prisma.user.create({
    data: {
      createdAt: getNowAsISO(),
      name,
      email,
      password: {
        create: {
          hash,
        },
      },
    },
  });
}
