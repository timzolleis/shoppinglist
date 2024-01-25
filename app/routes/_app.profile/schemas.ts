import { z } from 'zod';
import { TFunction } from 'i18next';
import { zfd } from 'zod-form-data';

export type UpdateUserSchema = z.infer<ReturnType<typeof updateUserSchema>>;
export const updateUserSchema = (translation: TFunction<'errors', undefined>) => zfd.formData({
  name: zfd.text(z.string({ required_error: translation('field.required', { field: 'name' }) }).min(3)),
  email: zfd.text(z.string({ required_error: translation('field.required', { field: 'email' }) }).email({
    message: (translation('field.wrongType', {
      field: 'email',
      type: 'email'
    }))
  }))
});

export type DeleteUserSchema = z.infer<ReturnType<typeof deleteUserSchema>>;
export const deleteUserSchema = (translation: TFunction<'errors', undefined>) => zfd.formData({
  password: zfd.text(z.string({ required_error: translation('field.required', { field: 'password' }) }).min(3))
});

export type ChangePasswordSchema = z.infer<ReturnType<typeof changePasswordSchema>>;
export const changePasswordSchema = (translation: TFunction<'errors', undefined>) => zfd.formData({
  password: zfd.text(z.string({ required_error: translation('changePassword.passwordMissing') }).min(3)),
  passwordConfirmation: zfd.text(z.string({ required_error: translation('changePassword.confirmationMissing') }).min(3))
});

export type Combine<T1, T2, T3> = {
  [K in keyof T1]: T1[K]
} & {
  [K in keyof T2]: T2[K]
} & {
  [K in keyof T3]: T3[K]
}
