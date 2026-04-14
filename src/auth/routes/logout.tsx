import { href, redirect } from 'react-router';
import { signOut } from '../auth.server';
import type { Route } from './+types/logout';

export async function loader({ request }: Route.LoaderArgs) {
  const logout = await signOut({
    headers: request.headers,
    returnHeaders: true,
  });

  throw redirect(href('/auth/login'), { headers: logout.headers });
}
