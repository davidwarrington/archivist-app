import { relative, type RouteConfig } from '@react-router/dev/routes';

const { index, prefix } = relative('src/user/routes');

export const userRoutes = prefix('/user', [
  index('index.tsx'),
]) satisfies RouteConfig;
