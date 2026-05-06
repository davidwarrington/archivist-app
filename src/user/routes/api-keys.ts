import { parseWithZod } from '@conform-to/zod/v4';
import * as z from 'zod';
import { getRequiredSession } from '~/auth/auth.server';
import { auth } from '~/auth/better-auth';
import { SECOND, WEEK } from '~/shared/utils/time';
import type { Route } from './+types/api-keys';

export const CreateApiKeySchema = z.object({
  name: z.string(),
});

export async function action({ context, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const { user } = getRequiredSession(context);

  const submission = parseWithZod(formData, { schema: CreateApiKeySchema });

  if (submission.status !== 'success') {
    return {
      lastResult: submission.reply(),
    };
  }

  const { name } = submission.value;

  const key = await auth.api.createApiKey({
    body: {
      name,
      expiresIn: WEEK / SECOND,
      userId: user.id,
    },
    headers: request.headers,
  });

  return {
    apiKey: {
      id: key.id,
      key: key.key,
    },
    lastResult: submission.reply(),
  };
}
