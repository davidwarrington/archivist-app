import { data, href, redirect } from 'react-router';
import { pdf } from '~/shared/utils/responses/pdf';
import {
  deleteDocument,
  DocumentDeleteDocumentNotFoundError,
} from '../operations/delete-document';
import {
  getDocument,
  GetDocumentDocumentNotFoundError,
} from '../operations/get-document';
import type { Route } from './+types/show';

export async function action({ params, request }: Route.ActionArgs) {
  if (request.method !== 'DELETE') {
    throw data('Method not allowed', { status: 405 });
  }

  try {
    await deleteDocument(params.id);

    return redirect(href('/documents'));
  } catch (error) {
    if (error instanceof DocumentDeleteDocumentNotFoundError) {
      throw data(error.message, { status: 404 });
    }

    throw error;
  }
}

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const document = await getDocument(params.id);

    return pdf(document);
  } catch (error) {
    if (error instanceof GetDocumentDocumentNotFoundError) {
      throw data('Document not found', { status: 404 });
    }

    throw error;
  }
}
