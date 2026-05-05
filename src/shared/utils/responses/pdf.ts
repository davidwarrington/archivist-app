export function pdf(content: BodyInit, init: number | ResponseInit = {}) {
  const responseInit = typeof init === 'number' ? { status: init } : init;

  const headers = new Headers(responseInit.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/pdf');
  }
  if (
    !headers.has('Content-Disposition') &&
    content instanceof File &&
    content.name
  ) {
    headers.set(
      'Content-Disposition',
      `attachment; filename="${content.name}"`,
    );
  }

  return new Response(content, {
    ...responseInit,
    headers,
  });
}
