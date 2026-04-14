import {
  Form,
  href,
  Link,
  redirect,
  type MiddlewareFunction,
} from 'react-router';
import * as z from 'zod';
import { getOptionalSession, signInEmail } from '../auth.server';
import { optionalAuthMiddleware } from '../middleware';
import type { Route } from './+types/login';

export const middleware: MiddlewareFunction[] = [optionalAuthMiddleware];

export function meta() {
  return [{ title: 'Login | Archivist' }];
}

const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
  callbackURL: z.string().optional(),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const json = LoginSchema.parse(Object.fromEntries(formData));

  const login = await signInEmail({
    body: json,
    headers: request.headers,
    returnHeaders: true,
  });

  throw redirect(login.response.url ?? href('/'), {
    headers: login.headers,
  });
}

export async function loader({ context }: Route.LoaderArgs) {
  const session = getOptionalSession(context);

  if (session) {
    throw redirect(href('/user'));
  }
}

export default function Component() {
  return (
    <div className="grid min-h-svh place-items-center-safe">
      <Form className="grid gap-6 text-center" method="POST">
        <h1 className="font-medium">Login to Archivist</h1>

        <div className="grid gap-2 text-left">
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input
              className="rounded-xs border border-zinc-200"
              id="email"
              name="email"
              type="email"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="password">Password</label>
            <input
              className="rounded-xs border border-zinc-200"
              id="password"
              name="password"
              type="password"
            />
          </div>
        </div>

        <footer className="grid justify-center-safe gap-2">
          <button
            className="cursor-pointer rounded bg-zinc-100 px-8 py-1"
            type="submit"
          >
            Log in
          </button>
          or
          <Link className="underline" to={href('/auth/register')}>
            Register
          </Link>
        </footer>
      </Form>
    </div>
  );
}
