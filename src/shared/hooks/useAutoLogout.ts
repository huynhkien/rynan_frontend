import { useEffect, useRef } from 'react';
import { useAppDispatch } from './useAppHook';
import { logout } from '@/features/user/store/userSlice';

const useAutoLogout = () => {
  const dispatch = useAppDispatch();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Thời gian đủ để logout
    const TWO_DAYS_IN_MS = 1 * 24 * 60 *60 * 1000;
    const autoLogout = () => {
      dispatch(logout());
      window.location.href = '/';
    };
    // Logout khi đóng tab
    const handleBeforeUnload = () => {
      dispatch(logout());
    };

    // Thêm event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    timeoutRef.current = window.setTimeout(autoLogout, TWO_DAYS_IN_MS);
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch]);
};

export default useAutoLogout;