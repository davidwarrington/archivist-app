import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod/v4';
import { Form, href, Link, type MiddlewareFunction } from 'react-router';
import * as z from 'zod';
import { getRequiredSession } from '~/auth/auth.server';
import { requiredAuthMiddleware } from '~/auth/middleware';
import { prisma } from '~/db';
import { DebugJson } from '~/shared/components/debug';
import { createDocuments } from '../operations/create-documents';
import type { Route } from './+types';

export const middleware: MiddlewareFunction[] = [requiredAuthMiddleware];

const ActionSchema = z.object({
  documents: z.array(z.file()).min(1),
});

export async function action({ context, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const session = getRequiredSession(context);

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const { documents } = submission.value;

  await createDocuments({ documents, userId: session.user.id });

  return submission.reply();
}

export async function loader({ context }: Route.LoaderArgs) {
  const session = getRequiredSession(context);
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    include: {
      documents: {
        where: { deletedAt: null },
      },
    },
  });

  return user;
}

export default function Component({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const { documents } = loaderData;
  const formatter = new Intl.DateTimeFormat('en-GB');

  const [form, fields] = useForm({
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ActionSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <div className="grid min-h-svh place-items-center-safe py-8">
      <div className="grid place-items-center-safe gap-8">
        <Form
          className="grid w-full max-w-300 gap-4 overflow-x-auto rounded border border-zinc-100 bg-zinc-50 p-4 text-sm"
          encType="multipart/form-data"
          method="post"
          {...getFormProps(form)}
        >
          <div className="relative grid gap-2">
            <label
              className="after:absolute after:inset-0"
              htmlFor={fields.documents.id}
            >
              Documents
            </label>
            <input
              {...getInputProps(fields.documents, { type: 'file' })}
              multiple
            />

            {!fields.documents.valid && (
              <div id={fields.documents.errorId}>
                {Object.values(fields.documents.allErrors).flat()}
              </div>
            )}
          </div>

          <footer>
            <button
              className="cursor-pointer rounded border border-zinc-200 bg-zinc-100 px-4 py-1"
              type="submit"
            >
              Upload
            </button>
          </footer>
        </Form>

        <div className="w-full max-w-300 overflow-x-auto rounded border border-zinc-100 bg-zinc-50 p-4 text-sm">
          <table className="w-full border-collapse overflow-x-auto border border-zinc-200 [&_th]:text-left [&_th,td]:border [&_th,td]:border-zinc-200 [&_th,td]:px-2 [&_th,td]:py-1">
            <thead>
              <tr className="[&>th]:text-left">
                <th>Filename</th>

                <th>Size</th>

                <th>Type</th>

                <th>Created At</th>

                <th></th>
              </tr>
            </thead>

            <tbody>
              {documents.map(document => (
                <tr key={document.id}>
                  <th scope="row">
                    <Link
                      download
                      target="_blank"
                      to={href('/documents/:id', { id: document.id })}
                    >
                      {document.filename}
                    </Link>
                  </th>

                  <td>{document.originalSize}</td>

                  <td>{document.mimeType}</td>

                  <td>{formatter.format(document.createdAt)}</td>

                  <td>
                    <Form
                      action={href('/documents/:id', { id: document.id })}
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
