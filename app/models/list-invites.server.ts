import { prisma } from '~/utils/db/prisma.server';
import { List, ListInvite } from '@prisma/client';
import { getNowAsISO } from '~/utils/date/date';

export async function findInvitesForList(listId: List['id']) {
  return prisma.listInvite.findMany({
    where: {
      listId
    }
  });
}

export async function findInviteByEmailAndListId(email: ListInvite['email'], listId: List['id']) {
  return prisma.listInvite.findFirst({
    where: {
      email,
      listId
    }
  });
}

export async function createInvite(email: ListInvite['email'], listId: List['id']) {
  return prisma.listInvite.create({
    data: {
      createdAt: getNowAsISO(),
      email,
      listId
    }
  });
}

export async function deleteInvite(inviteId: ListInvite['id']) {
  return prisma.listInvite.delete({
    where: {
      id: inviteId
    }
  });
}
