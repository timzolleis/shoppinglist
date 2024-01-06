import { List, User } from '@prisma/client';
import { prisma } from '~/utils/db/prisma.server';
import { getNowAsISO } from '~/utils/date/date';
import { findUserById } from '~/models/user.server';


export async function findUserLists(userId: User['id']) {
  return prisma.list.findMany({
    where: {
      owner: {
        id: userId
      },
      deletedAt: null
    }
  });
}

export async function findDeletedUserLists(userId: User['id']) {
  return prisma.list.findMany({
    where: {
      owner: {
        id: userId
      },
      deletedAt: {
        not: null
      }
    }
  });
}

export async function getDefaultListId(userId: User['id']) {
  const user = await findUserById(userId);
  return user?.defaultListId;
}

export function findListById(listId: List['id']) {
  return prisma.list.findUnique({
    where: {
      id: listId,
    }
  });
}


export async function createList(name: List['name'], userId: User['id']) {
  return prisma.list.create({
    data: {
      createdAt: getNowAsISO(),
      name,
      owner: {
        connect: {
          id: userId
        }
      }
    }
  });
}

export async function deleteList(listId: List['id']) {
  return prisma.list.update({
    where: {
      id: listId
    },
    data: {
      deletedAt: getNowAsISO()
    }
  });
}

export async function recoverList(listId: List['id']) {
  return prisma.list.update({
    where: {
      id: listId
    },
    data: {
      deletedAt: null
    }
  });
}

export async function hardDeleteList(listId: List['id']) {
  return prisma.list.delete({
    where: {
      id: listId
    }
  });
}