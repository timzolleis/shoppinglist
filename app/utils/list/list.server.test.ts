import { describe } from 'vitest';
import { requireListOwnership } from '~/utils/list/list.server';
import listTestData from '~/__tests__/listTestData';
import { faker } from '@faker-js/faker';


describe('require ownership', () => {


  test('given list with same owner then no error is thrown', () => {
    expect(() => requireListOwnership(listTestData.listWithOwner, listTestData.owner)).not.toThrowError();
  });

  test('given list with different owner then error is thrown', () => {
    const list = {
      ...listTestData.listWithOwner,
      owner: {
        ...listTestData.owner,
        id: faker.string.uuid(),
      },
    };
    expect(() => requireListOwnership(list, listTestData.owner)).toThrowError();
  });

  test('given list is null then error is thrown', () => {
    expect(() => requireListOwnership(null, listTestData.owner)).toThrowError();

  });
});