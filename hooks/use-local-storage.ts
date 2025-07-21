'use client';

import { useState, useEffect } from 'react';
import { LocalStorageHelper } from '@/lib/utils';
import type { UseLocalStorageReturn } from '@/types';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const storedValue = LocalStorageHelper.get(key, initialValue);
    setValue(storedValue);
  }, [key, initialValue]);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    LocalStorageHelper.set(key, newValue);
  };

  const removeValue = () => {
    setValue(initialValue);
    LocalStorageHelper.remove(key);
  };

  return {
    value,
    setValue: setStoredValue,
    removeValue,
  };
}