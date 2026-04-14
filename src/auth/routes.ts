import { relative, type RouteConfig } from '@react-router/dev/routes';

const { prefix, route } = relative('src/auth/routes');

export const authRoutes = prefix('auth', [
  route('login', 'login.tsx'),
  route('logout', 'logout.tsx'),
  route('register', 'register.tsx'),
]) satisfies RouteConfig;
