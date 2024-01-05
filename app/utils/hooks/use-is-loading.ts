import { useNavigation } from 'react-router';

export function useIsLoading(requiredFormEntry?: string) {
  const navigation = useNavigation();
  if (!requiredFormEntry) {
    return navigation.state === 'submitting';
  }
  return navigation.state === 'submitting' && navigation.formData?.has(requiredFormEntry);
}
