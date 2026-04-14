import { defineConfig } from 'prisma/config';
import { env } from './src/env';

export default defineConfig({
  schema: 'database/schema.prisma',
  migrations: {
    path: 'database/migrations',
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
