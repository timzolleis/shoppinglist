import { Params } from '@remix-run/react';

export function requireRouteParam(param: string, params: Params) {
  const value = params[param];
  if (!value) {
    throw new Error(`Missing route parameter: ${param}`);
  }
  return value;
}

export function getSearchParam(url: string, param: string) {
  const searchParams = new URL(url).searchParams;
  return searchParams.get(param);
}