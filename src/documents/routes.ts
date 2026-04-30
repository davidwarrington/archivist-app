import { relative, type RouteConfig } from '@react-router/dev/routes';

const { index, prefix, route } = relative('src/documents/routes');

export const documentsRoutes = prefix('/documents', [
  index('index.tsx'),
  route(':id', 'show.ts'),
]) satisfies RouteConfig;
