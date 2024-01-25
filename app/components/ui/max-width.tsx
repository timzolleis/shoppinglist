import { ReactNode } from 'react';

export const MaxWidth = ({ children }: { children: ReactNode }) => {
  return <div className={'mx-auto w-full max-w-[640px]'}>
    {children}
  </div>;
};