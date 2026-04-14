import { href, redirect, type MiddlewareFunction } from 'react-router';
import { getOptionalSession } from '~/auth/auth.server';
import { optionalAuthMiddleware } from '~/auth/middleware';
import { Welcome } from '../components/welcome/welcome';
import type { Route } from './+types/home';

export const middleware: MiddlewareFunction[] = [optionalAuthMiddleware];

export function meta() {
  return [{ title: 'Archivist' }];
}

export function loader({ context }: Route.LoaderArgs) {
  const session = getOptionalSession(context);

  if (!session) {
    throw redirect(href('/auth/login'));
  }
}

export default function Component() {
  return <Welcome />;
}
