import { createHash, randomUUID } from 'node:crypto';
import { existsSync, type PathLike } from 'node:fs';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { prisma } from '~/db';
import { env } from '~/env';

function ensureDirectoryExists(path: PathLike) {
  return mkdir(path, { recursive: true });
}

function getUniqueFilename(file: File) {
  const extension = extname(file.name);

  return `${randomUUID()}.${extension}`;
}

export async function createDocuments({
  documents,
  userId,
}: {
  documents: File[];
  userId: string;
}) {
  return prisma.$transaction(() =>
    Promise.all(
      documents.map(file => createDocument({ document: file, userId })),
    ),
  );
}

async function createDocument({
  document,
  userId,
}: {
  document: File;
  userId: string;
}) {
  await ensureDirectoryExists(env.DOCUMENTS_DIRECTORY);

  const uniqueFilename = getUniqueFilename(document);
  const outputPath = join(env.DOCUMENTS_DIRECTORY, uniqueFilename);
  const isAlreadyInFileSystem = existsSync(outputPath);

  if (isAlreadyInFileSystem) {
    return createDocument({ document, userId });
  }

  const buffer = Buffer.from(await document.arrayBuffer());
  const checksum = createHash('sha256').update(buffer).digest('hex');

  await writeFile(outputPath, buffer);

  try {
    await prisma.document.create({
      data: {
        filename: uniqueFilename,
        originalFilename: document.name,
        originalSize: document.size,
        originalChecksum: checksum,
        /** @todo extract content from document */
        content: '',
        mimeType: document.type,
        uploadedById: userId,
      },
    });
  } catch (error) {
    await unlink(outputPath);

    throw error;
  }
}
