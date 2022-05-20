import { useEffect, useState, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function useLockBodyScroll(initialLocked: boolean) {
  const [locked, setLocked] = useState(initialLocked);

  useIsomorphicLayoutEffect(() => {
    if (!locked) return;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'relative';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('touch-action');
      document.documentElement.style.removeProperty('overflow');
    };
  }, [locked]);

  useEffect(() => {
    if (locked !== initialLocked) setLocked(initialLocked);
  }, [initialLocked]);

  return [locked, setLocked];
}
