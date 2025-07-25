import { useEffect } from 'react';
import { useAppDispatch } from './useAppHook';
import { logout } from '@/features/user/store/userSlice';

const useAutoLogout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleBeforeUnload = () => {
      const url = 'https://rynan-api.onrender.com/api/user/logout';
      const data = null; 
      
      const success = navigator.sendBeacon(url, data);
      
      if (!success) {
        console.error('Failed to queue logout request');
      }

      dispatch(logout());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch]);

  return null;
};

export default useAutoLogout;
