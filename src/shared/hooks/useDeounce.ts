import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, ms: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, ms);

    return () => clearTimeout(timeoutId);
  }, [value, ms]);

  return debouncedValue;
};
