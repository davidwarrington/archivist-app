import { join } from 'node:path';
import { env } from '~/env';

export function getDocumentLocation(filename: string) {
  return join(env.DOCUMENTS_DIRECTORY, filename);
}
