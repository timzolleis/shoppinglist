import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export function getErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return fromZodError(error).message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

export function getFormErrors(e: unknown) {
  if (e instanceof ZodError) {
    return e.formErrors.fieldErrors;
  }
  return undefined;
}

export type FormErrors<T> = {
  [K in keyof T]?: string;
};
