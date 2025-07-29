'use client';

import useAutoLogout from '@/shared/hooks/useAutoLogout';
import useAutoRefreshToken from '@/shared/hooks/useAutoRefreshToken';
import { ReactNode } from 'react';

export const AutoLogoutWrapper = ({ children }: {children: ReactNode}) => {
  useAutoLogout();
  useAutoRefreshToken();
  return <>{children}</>;
};
