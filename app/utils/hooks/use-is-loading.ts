import { useNavigation } from 'react-router';

export function useIsLoading(requiredFormEntry?: (formData: FormData | undefined) => boolean) {
  const navigation = useNavigation();
  if (!requiredFormEntry) {
    return navigation.state === 'submitting';
  }
  return navigation.state === 'submitting' && requiredFormEntry(navigation.formData);
}
