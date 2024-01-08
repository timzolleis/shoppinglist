import { PrismaClient } from '@prisma/client';

export const singleton = <Value>(name: string, valueFactory: () => Value): Value => {
  const g = global as { __singletons?: Record<string, Value> };
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory();
  return g.__singletons[name];
};
// Hard-code a unique key, so we can look up the client when this module gets re-imported
const prisma = singleton('prisma', () => new PrismaClient({
  errorFormat: 'minimal'
}));
prisma.$connect().catch(err => console.log('ERROR'));

export { prisma };
export * from '@prisma/client';
