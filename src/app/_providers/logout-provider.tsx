'use client';

import useAutoLogout from '@/shared/hooks/useAutoLogout';
import { ReactNode } from 'react';

export const AutoLogoutWrapper = ({ children }: {children: ReactNode}) => {
  useAutoLogout();

  return <>{children}</>;
};
