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

   

    const handleBeforeUnload = () => {
      performLogout();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch]);

  return null;
};

export default useAutoLogout;
