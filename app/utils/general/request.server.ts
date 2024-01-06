import { Params } from '@remix-run/react';

export function requireRouteParam(param: string, params: Params) {
  const value = params[param];
  if (!value) {
    throw new Error(`Missing route parameter: ${param}`);
  }
  return value;
}