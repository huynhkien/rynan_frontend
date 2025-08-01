import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch } from './useAppHook';
import { logout } from '@/features/user/store/userSlice';

type ActivityEvent = 'mousedown' | 'mousemove' | 'keypress' | 'scroll' | 'touchstart' | 'click';

interface UseAutoLogoutOptions {
  inactivityTime?: number;
  checkInterval?: number;
}

const useAutoLogout = (options: UseAutoLogoutOptions = {}) => {
  const dispatch = useAppDispatch();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const INACTIVITY_TIME = options.inactivityTime ?? 24 * 60 * 60 * 1000;
  const CHECK_INTERVAL = options.checkInterval ?? 5 * 60 * 1000;

  const autoLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      if (timeSinceLastActivity >= INACTIVITY_TIME) {
        autoLogout();
      } else {
        const remainingTime = INACTIVITY_TIME - timeSinceLastActivity;
        timeoutRef.current = setTimeout(autoLogout, remainingTime);
      }
    }, INACTIVITY_TIME);
  }, [autoLogout, INACTIVITY_TIME]);

  useEffect(() => {
    const activityEvents: ActivityEvent[] = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    const handleActivity = (): void => {
      resetTimer();
    };

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        resetTimer();
      }
    };

    const handleBeforeUnload = () => {
      dispatch(logout());
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload); 

    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch, resetTimer]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      if (timeSinceLastActivity >= INACTIVITY_TIME) {
        autoLogout();
      }
    }, CHECK_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoLogout, INACTIVITY_TIME, CHECK_INTERVAL]);
};

export default useAutoLogout;
