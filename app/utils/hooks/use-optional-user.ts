import { useMatchesData } from '~/utils/hooks/use-matches-data';
import { User } from '@prisma/client';

export function useOptionalUser() {
  const data = useMatchesData('root') as { user?: User };
  if (!data) {
    return undefined;
  }
  return data.user;
}
  