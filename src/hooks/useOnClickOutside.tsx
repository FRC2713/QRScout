import React, { useEffect, useRef } from 'react';

export const useOnClickOutside = (
  ref: React.MutableRefObject<HTMLElement | null>,
  callback: VoidFunction,
): void => {
  const savedCallback = useRef<VoidFunction>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent): void => {
      if (
        ref &&
        ref.current &&
        event.target &&
        !ref.current.contains(event.target as Node)
      ) {
        if (savedCallback.current) {
          savedCallback.current();
        }
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref]);
};
