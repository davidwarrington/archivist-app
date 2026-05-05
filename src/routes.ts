import { type RouteConfig } from '@react-router/dev/routes';
import { authRoutes } from './auth/routes';
import { coreRoutes } from './core/routes';
import { documentsRoutes } from './documents/routes';
import { userRoutes } from './user/routes';

export default [
  ...authRoutes,
  ...coreRoutes,
  ...documentsRoutes,
  ...userRoutes,
] satisfies RouteConfig;
