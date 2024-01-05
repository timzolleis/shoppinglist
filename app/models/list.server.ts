import { List, User } from '@prisma/client';
import { prisma } from '~/utils/db/prisma.server';
import { getNowAsISO } from '~/utils/date/date';


export function findUserLists(userId: User["id"]){
  return prisma.list.findMany({
    where: {
      owner: {
        id: userId
      }
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