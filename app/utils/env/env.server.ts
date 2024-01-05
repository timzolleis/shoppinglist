import { z } from 'zod';

export const envSchema = z.object({
  APPLICATION_SECRET: z.string(),
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
