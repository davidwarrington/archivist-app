import {
  Form,
  href,
  Link,
  redirect,
  type MiddlewareFunction,
} from 'react-router';
import * as z from 'zod';
import { getOptionalSession, signUpEmail } from '../auth.server';
import { optionalAuthMiddleware } from '../middleware';
import type { Route } from './+types/register';

export const middleware: MiddlewareFunction[] = [optionalAuthMiddleware];

export function meta() {
  return [{ title: 'Register | Archivist' }];
}

const RegisterSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const body = RegisterSchema.parse(Object.fromEntries(formData));

  const register = await signUpEmail({
    body,
    headers: request.headers,
    returnHeaders: true,
  });

  return redirect(href('/'), { headers: register.headers });
}

export async function loader({ context }: Route.LoaderArgs) {
  const session = getOptionalSession(context);

  if (session) {
    throw redirect(href('/'));
  }
}

export default function Component() {
  return (
    <div className="grid min-h-svh place-items-center-safe">
      <Form className="grid gap-6 text-center" method="POST">
        <h1 className="font-medium">Register</h1>

        <div className="grid gap-2 text-left">
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
            <input
              className="rounded-xs border border-zinc-200"
              id="name"
              name="name"
              type="text"
            />
          </div>

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
            Register
          </button>
          or
          <Link className="underline" to={href('/auth/login')}>
            Log in
          </Link>
        </footer>
      </Form>
    </div>
  );
}
