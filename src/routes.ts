import { type RouteConfig } from '@react-router/dev/routes';
import { authRoutes } from './auth/routes';
import { coreRoutes } from './core/routes';
import { userRoutes } from './user/routes';

export default [
  ...authRoutes,
  ...coreRoutes,
  ...userRoutes,
] satisfies RouteConfig;
