import { apiKey } from '@better-auth/api-key';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '~/db';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    apiKey({
      schema: {
        apikey: {
          modelName: 'apiKey',
        },
      },
    }),
  ],
});
