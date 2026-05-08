import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod/v4';
import { Form, href, Link, useFetcher } from 'react-router';
import { getRequiredSession } from '~/auth/auth.server';
import { auth } from '~/auth/better-auth';
import { DebugJson } from '~/shared/components/debug';
import type { Route } from './+types';
import { CreateApiKeySchema, type action as apiKeysAction } from './api-keys';

export function meta() {
  return [{ title: 'Archivist' }];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = getRequiredSession(context);
  const { apiKeys } = await auth.api.listApiKeys({ headers: request.headers });

  return {
    apiKeys,
    session,
  };
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const { apiKeys } = loaderData;
  const formatter = new Intl.DateTimeFormat('en-GB');
  const apiKeysFetcher = useFetcher<typeof apiKeysAction>();

  const [form, fields] = useForm({
    lastResult: apiKeysFetcher.data?.lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CreateApiKeySchema });
    },

    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <div className="grid min-h-svh place-items-center-safe">
      <div className="grid place-items-center-safe gap-8">
        <apiKeysFetcher.Form
          action={href('/user/api-keys')}
          className="grid w-full max-w-300 gap-4 overflow-x-auto rounded border border-zinc-100 bg-zinc-50 p-4 text-sm"
          encType="multipart/form-data"
          method="POST"
          {...getFormProps(form)}
        >
          <div className="relative grid gap-2">
            <label
              className="after:absolute after:inset-0"
              htmlFor={fields.name.id}
            >
              Name
            </label>
            <input
              className="border border-zinc-200 px-2 py-1"
              {...getInputProps(fields.name, { type: 'text' })}
              multiple
            />

            {!fields.name.valid && (
              <div id={fields.name.errorId}>{fields.name.errors}</div>
            )}
          </div>

          <footer>
            <button
              className="cursor-pointer rounded border border-zinc-200 bg-zinc-100 px-4 py-1"
              type="submit"
            >
              Generate
            </button>
          </footer>
        </apiKeysFetcher.Form>

        <div className="w-full max-w-300 overflow-x-auto rounded border border-zinc-100 bg-zinc-50 p-4 text-sm">
          <table className="w-full border-collapse overflow-x-auto border border-zinc-200 [&_th]:text-left [&_th,td]:border [&_th,td]:border-zinc-200 [&_th,td]:px-2 [&_th,td]:py-1">
            <thead>
              <tr className="[&>th]:text-left">
                <th>Name</th>

                <th>Key</th>

                <th>Created At</th>

                <th></th>
              </tr>
            </thead>

            <tbody>
              {apiKeys.map(apiKey => (
                <tr key={apiKey.id}>
                  <th scope="row">
                    <Link
                      download
                      target="_blank"
                      to={href('/documents/:id', { id: apiKey.id })}
                    >
                      {apiKey.name}
                    </Link>
                  </th>

                  <td>
                    {apiKeysFetcher.data?.apiKey?.id === apiKey.id
                      ? apiKeysFetcher.data.apiKey.key
                      : `${apiKey.start}\u2217\u2217\u2217`}
                  </td>

                  <td>{formatter.format(apiKey.createdAt)}</td>

                  <td>
                    <Form
                      action={href('/user/api-keys/:id', { id: apiKey.id })}
                      method="DELETE"
                    >
                      <button
                        className="w-full cursor-pointer text-center"
                        type="submit"
                      >
                        Delete
                      </button>
                    </Form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
