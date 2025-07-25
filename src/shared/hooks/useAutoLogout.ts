import { useEffect } from 'react';
import { useAppDispatch } from './useAppHook';
import { logout } from '@/features/user/store/userSlice';

const useAutoLogout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let isLoggingOut = false;

    const performLogout = () => {
      if (isLoggingOut) return;
      isLoggingOut = true;

      dispatch(logout());

      navigator.sendBeacon?.('/api/user/logout'); 
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        performLogout();
      }
    };

    const handleBeforeUnload = () => {
      performLogout();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch]);

  return null;
};

export default useAutoLogout;
