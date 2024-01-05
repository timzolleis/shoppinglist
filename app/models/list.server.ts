import { User } from '@prisma/client';
import { prisma } from '~/utils/db/prisma.server';


export function findUserLists(userId: User["id"]){
  return prisma.list.findMany({
    where: {
      owner: {
        id: userId
      }
    },
  });
}