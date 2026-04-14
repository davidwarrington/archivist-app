import { RouterContextProvider } from 'react-router';
import { auth } from './better-auth';
import { optionalAuthContext, requiredAuthContext } from './middleware';

export function getRequiredSession(context: Readonly<RouterContextProvider>) {
  return context.get(requiredAuthContext);
}

export function getOptionalSession(context: Readonly<RouterContextProvider>) {
  return context.get(optionalAuthContext);
}

export const { signInEmail, signUpEmail, signOut } = auth.api;
