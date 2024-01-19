import { ListWithOwner } from '~/models/list.server';
import { User } from '@prisma/client';


export function requireListOwnership(list: ListWithOwner, owner: User) {
  if (list?.owner.id !== owner.id) {
    throw new Error('You do not own this list');
  }
}