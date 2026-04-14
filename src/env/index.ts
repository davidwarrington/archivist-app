import 'dotenv/config';
import * as z from 'zod';

const EnvSchema = z.object({
  DATABASE_URL: z.string().default('file:db.sqlite'),
});

export const env = EnvSchema.parse(process.env);
