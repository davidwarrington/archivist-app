import { relative } from '@react-router/dev/routes';

const { index, route } = relative('src/user/routes');

export const userRoutes = route('/user', 'layout.ts', [
  index('index.tsx'),
  route('api-keys', 'api-keys.ts'),
  route('api-keys/:id', 'api-keys.show.ts'),
]);
