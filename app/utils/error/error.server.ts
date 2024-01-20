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
    //Go through each key and make it lowercase
    const keys = Object.keys(e.formErrors.fieldErrors);
    const formErrors = new Map<string, string>();
    keys.forEach(key => {
      const error = e.formErrors.fieldErrors[key];
      if (error) {
        const message = `${error?.[0]}`;
        formErrors.set(key, message);
      }
    });
    return Object.fromEntries(formErrors);
  }
  return undefined;
}

export type FormErrors<T> = {
  [K in keyof T]?: string;
};
