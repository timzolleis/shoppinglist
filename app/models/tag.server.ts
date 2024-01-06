import { List, Tag } from '@prisma/client';
import { prisma } from '~/utils/db/prisma.server';

interface CreateTagForListProps {
  listId: List['id'];
  name: string;
  color: string;
}

export function createTagForList({ listId, name, color }: CreateTagForListProps) {
  return prisma.tag.create({
    data: {
      name,
      color,
      lists: {
        connect: {
          id: listId
        }
      }
    }
  });
}

export async function removeTagForList({ listId, tagId }: { listId: List['id'], tagId: Tag['id'] }) {
  //Check if the tag is used anywhere
  const tag = await prisma.tag.findUnique({
    where: {
      id: tagId
    },
    include: {
      lists: true
    }
  });
  if (tag && tag.lists.length > 0) {
    return prisma.tag.delete({
      where: {
        id: tagId
      }
    });
  } else {
    return prisma.tag.update({
      where: {
        id: tagId
      },
      data: {
        lists: {
          disconnect: {
            id: listId
          }
        }
      }
    });
  }
}