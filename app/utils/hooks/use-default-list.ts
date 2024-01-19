import { useMatchesData } from '~/utils/hooks/use-matches-data';
import { User } from '@prisma/client';


export function useDefaultList(){
  const data = useMatchesData('routes/_app.lists') as { defaultListId?: string };
  if (!data || !data.defaultListId) {
    return undefined;
  }
  return data.defaultListId;
}