import { useFetchers } from '@remix-run/react';


export function usePendingInvites() {
  const fetchers = useFetchers();
  const fetchersWithFormData = fetchers.filter(fetcher => fetcher.formData);
  return fetchersWithFormData
    .map(fetcher => {
      return {
        email: fetcher.formData?.get('email')?.toString(),
        id: fetcher.formData?.get('id')?.toString()
      };
    })
    .filter(invite => invite.email) as { email: string, id: string }[];
}