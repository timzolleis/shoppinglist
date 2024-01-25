import { faker } from '@faker-js/faker';
import { ListWithOwner } from '~/models/list.server';
import { User } from '@prisma/client';

const owner: User = {
  id: faker.string.uuid(),
  defaultListId: faker.string.uuid(),
  createdAt: faker.date.recent().toDateString(),
  email: faker.internet.email(),
  name: faker.person.lastName(),
};
const listWithOwner: ListWithOwner = {
  owner,
  name: faker.string.alphanumeric(),
  createdAt: faker.date.recent().toDateString(),
  id: faker.string.uuid(),
  ownerId: faker.string.uuid(),
  deletedAt: null,
};

export default {
  owner, listWithOwner,
};
