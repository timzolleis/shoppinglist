import { useNavigation } from 'react-router';
import { useEffect, useState } from 'react';

export function useIsLoading(requiredFormEntry?: (formData: FormData | undefined) => boolean) {
  const navigation = useNavigation();
  const [wasSubmitting, setWasSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (navigation.state === 'submitting') {
      setWasSubmitting(true);
      setIsLoading(requiredFormEntry ? requiredFormEntry(navigation.formData) : true);
    }
    if (navigation.state === 'loading' && wasSubmitting) {
      setWasSubmitting(false);
    }
    if (navigation.state === 'idle') {
      setIsLoading(false);
    }

  }, [navigation]);
  return isLoading;
}
