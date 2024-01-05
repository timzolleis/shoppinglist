import { List, User } from '@prisma/client';
import { prisma } from '~/utils/db/prisma.server';
import { getNowAsISO } from '~/utils/date/date';


export function findUserLists(userId: User["id"]){
  return prisma.list.findMany({
    where: {
      owner: {
        id: userId
      },
      deletedAt: null
    },
  });
}

export function findListById(listId: List["id"]){
  return prisma.list.findUnique({
    where: {
      id: listId,
      deletedAt: null
    },
  });

}

export function createList(name: List["name"], userId: User["id"]){
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
  })
}

export function deleteList(listId: List["id"]){
  return prisma.list.update({
    where: {
      id: listId
    },
    data: {
      deletedAt: getNowAsISO()
    }
  })
}