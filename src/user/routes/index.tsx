import { href, Link, type MiddlewareFunction } from 'react-router';
import { getRequiredSession } from '~/auth/auth.server';
import { requiredAuthMiddleware } from '~/auth/middleware';
import { DebugJson } from '~/shared/components/debug';
import type { Route } from '../../core/routes/+types/home';

export const middleware: MiddlewareFunction[] = [requiredAuthMiddleware];

export function meta() {
  return [{ title: 'Archivist' }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const session = getRequiredSession(context);

  return session;
}

export default function Component({ loaderData }: Route.ComponentProps) {
  return (
    <div className="grid min-h-svh place-items-center-safe">
      <div className="grid place-items-center-safe gap-8">
        <DebugJson
          className="w-full max-w-300 overflow-x-auto rounded border border-zinc-100 bg-zinc-50 p-4 text-sm"
          data={loaderData}
        />

        <Link
          className="cursor-pointer rounded bg-zinc-100 px-8 py-1"
          to={href('/auth/logout')}
        >
          Logout
        </Link>
      </div>
    </div>
  );
}
