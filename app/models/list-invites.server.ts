import { prisma } from '~/utils/db/prisma.server';
import { List, ListInvite, Prisma, User } from '@prisma/client';
import { getNowAsISO } from '~/utils/date/date';


export async function findInvitesForUser(email: User['email'], showAll = false) {
  return prisma.listInvite.findMany({
    where: {
      email,
      status: showAll ? undefined : 'pending'
    },
    include: {
      list: {
        include: {
          owner: true
        }
      }
    }
  });
}

export async function findListInvites(listId: List['id'], all = false) {
  return prisma.listInvite.findMany({
    where: {
      listId,
      status: 'pending',
      usedAt: null
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

export async function findInviteById(inviteId: ListInvite['id']) {
  return prisma.listInvite.findUnique({
    where: {
      id: inviteId
    }
  });
}

export async function createInvite(id: ListInvite['id'], listId: List['id'], email: ListInvite['email']) {
  return prisma.listInvite.create({
    data: {
      id,
      createdAt: getNowAsISO(),
      email,
      listId
    }
  });
}

export async function updateInvite(inviteId: ListInvite['id'], data: Prisma.ListInviteUncheckedUpdateInput) {
  return prisma.listInvite.update({
    where: {
      id: inviteId
    },
    data
  });
}

export async function deleteInvite(inviteId: ListInvite['id']) {
  return prisma.listInvite.delete({
    where: {
      id: inviteId
    }
  });
}


export async function getPendingInvitesForEmailAndList(email: ListInvite['email'], listId: List['id']) {
  return prisma.listInvite.findMany({
    where: {
      email,
      listId,
      status: 'pending'
    }
  });
}