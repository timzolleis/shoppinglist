import { List, User } from '@prisma/client';
import { prisma } from '~/utils/db/prisma.server';
import pbkdf2 from 'pbkdf2-passworder';
import { getNowAsISO } from '~/utils/date/date';


export function findUserById(id: User['id']) {
  return prisma.user.findUnique({
    where: {
      id
    }
  });
}

export function findUserByEmailAndListId(email: User['email'], listId: List['id']) {
  return prisma.user.findFirst({
    where: {
      email,
      lists: {
        some: {
          id: listId
        }
      }
    }
  });
}

export async function findUserWithPasswordByEmail(email: User['email']) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      password: true
    }
  });
}

export async function createUser({
                                   name,
                                   email,
                                   password
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
          hash
        }
      }
    }
  });
}

export function setDefaultList({ userId, listId }: { userId: User['id'], listId: List['id'] | null }) {
  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      defaultListId: listId
    }
  });
}