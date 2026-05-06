import { data, href, redirect } from 'react-router';
import { auth } from '~/auth/better-auth';
import type { Route } from './+types/api-keys.show';

export async function action({ params, request }: Route.ActionArgs) {
  if (request.method !== 'DELETE') {
    throw data('Method not allowed', { status: 405 });
  }

  await auth.api.deleteApiKey({
    body: { keyId: params.id },
    headers: request.headers,
  });

  return redirect(href('/user'));
}
