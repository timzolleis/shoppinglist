import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';
import { Simulate } from 'react-dom/test-utils';
import load = Simulate.load;

export function useMatchesData(id: string) {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data;
}

