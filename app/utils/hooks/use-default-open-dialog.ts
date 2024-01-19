import { useEffect, useState } from 'react';

export function useDefaultOpenDialog(defaultOpen: boolean = false) {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => {
    setOpen(true);
  }, []);
  return [open, setOpen] as const;
}