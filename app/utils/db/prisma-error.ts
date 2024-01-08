import { Prisma } from '.prisma/client';
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;
import PrismaClientInitializationError = Prisma.PrismaClientInitializationError;

export const PRISMA_ERRORS = {
  UNIQUE_VIOLATION: 'errors.uniqueViolation',
  DATABASE_UNREACHABLE: 'errors.databaseUnreachable',
  DATABASE_TIMEOUT: 'errors.databaseTimeout'
};

const prismaErrorMap = {
  [PRISMA_ERRORS.UNIQUE_VIOLATION]: 'P2002',
  [PRISMA_ERRORS.DATABASE_UNREACHABLE]: 'P1001',
  [PRISMA_ERRORS.DATABASE_TIMEOUT]: 'P1002'

};


export function getPrismaErrorMessage(error: unknown) {
  if (error instanceof PrismaClientInitializationError) {
    const code = error.errorCode;
    return code ? prismaErrorMap[code] : error.message;
  }
  if (error instanceof PrismaClientKnownRequestError) {
    return prismaErrorMap[error.code] ?? error.message;
  }
  return undefined;
}