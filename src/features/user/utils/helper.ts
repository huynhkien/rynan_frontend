const isClient = typeof window !== 'undefined';

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    // Chỉ truy cập localStorage khi đang ở client-side
    if (!isClient) {
      return defaultValue;
    }
    
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage item ${key}:`, error);
    return defaultValue;
  }
};

export const setToLocalStorage = <T>(key: string, value: T): void => {
  try {
    if (!isClient) {
      return;
    }
    
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error);
  }
};

export const removeToLocalStorage = (key: string): void => {
  try {
    if (!isClient) {
      return;
    }
    
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage item ${key}:`, error);
  }
};