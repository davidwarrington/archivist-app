import { readFile } from 'node:fs/promises';
import { prisma } from '~/db';
import { getDocumentLocation } from '../file-system';

export async function getDocument(id: string) {
  const document = await prisma.document.findUnique({
    where: { id: id },
  });

  if (!document) {
    throw new GetDocumentDocumentNotFoundError('Document not found');
  }

  const file = await readFile(getDocumentLocation(document.filename));

  return new File([file], document.originalFilename);
}

export class GetDocumentDocumentNotFoundError extends Error {
  constructor(...args: Parameters<typeof Error>) {
    super(...args);
  }
}
