import { unlink } from 'node:fs/promises';
import { prisma } from '~/db';
import { getDocumentLocation } from '../file-system';

export async function deleteDocument(id: string) {
  const document = await prisma.document.findUnique({
    where: { id },
  });

  if (!document) {
    throw new DocumentDeleteDocumentNotFoundError('Document not found');
  }

  await Promise.all([
    prisma.document.update({
      where: { id: document.id },
      data: { deletedAt: new Date() },
    }),
    unlink(getDocumentLocation(document.filename)),
  ]);
}

export class DocumentDeleteDocumentNotFoundError extends Error {
  constructor(...args: Parameters<typeof Error>) {
    super(...args);
  }
}
