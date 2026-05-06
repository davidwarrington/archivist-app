import type { MiddlewareFunction } from 'react-router';
import { requiredAuthMiddleware } from '~/auth/middleware';

export const middleware: MiddlewareFunction[] = [requiredAuthMiddleware];
