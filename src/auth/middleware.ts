import {
  createContext,
  href,
  redirect,
  type MiddlewareFunction,
} from 'react-router';
import { auth } from './better-auth';

type Session = typeof auth.$Infer.Session;

// eslint-disable-next-line @eslint-react/naming-convention-context-name
export const requiredAuthContext = createContext<Session>();

export const requiredAuthMiddleware: MiddlewareFunction = async function ({
  context,
  request,
}) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    throw redirect(href('/auth/login'));
  }

  context.set(requiredAuthContext, session);
};

// eslint-disable-next-line @eslint-react/naming-convention-context-name
export const optionalAuthContext = createContext<Session | null>(null);

export const optionalAuthMiddleware: MiddlewareFunction = async function ({
  context,
  request,
}) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  context.set(optionalAuthContext, session ?? null);
};
