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
    window.location.href = '/';
  }, [dispatch]);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    // Clear timeout cũ
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set timeout mới
    timeoutRef.current = setTimeout(() => {
      // Check lại thời gian inactive trước khi logout
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      
      if (timeSinceLastActivity >= INACTIVITY_TIME) {
        autoLogout();
      } else {
        // Nếu chưa đủ thời gian, set lại timeout
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
      'click'
    ];

    const handleActivity = (): void => {
      resetTimer();
    };

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        resetTimer();
      }
    };

    const handleBeforeUnload = (): void => {
      sessionStorage.setItem('beforeUnloadTime', Date.now().toString());
    };

    const handleUnload = (): void => {
      const beforeUnloadTime = sessionStorage.getItem('beforeUnloadTime');
      const now = Date.now();
      
      // Nếu có beforeUnloadTime và thời gian từ beforeUnload đến unload ngắn (< 100ms)
      // thì nhiều khả năng là đóng tab/browser thật sự, không phải refresh
      if (beforeUnloadTime) {
        const timeDiff = now - parseInt(beforeUnloadTime);
        
        // Nếu thời gian ngắn và không phải navigation refresh
        if (timeDiff < 100 && 
            performance.navigation && 
            performance.navigation.type !== 1) {
          dispatch(logout());
        }
        
        // Clean up
        sessionStorage.removeItem('beforeUnloadTime');
      }
    };

    // Đăng ký event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    // Khởi tạo timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [dispatch, resetTimer]);

  // Periodic check để đảm bảo logic hoạt động đúng
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