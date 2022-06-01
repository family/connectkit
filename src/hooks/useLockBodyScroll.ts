import { useEffect, useState, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function useLockBodyScroll(initialLocked: boolean) {
  const [locked, setLocked] = useState(initialLocked);

  useIsomorphicLayoutEffect(() => {
    if (!locked) return;

    const original = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      touchAction: document.body.style.touchAction,
      htmlOverflow: document.documentElement.style.overflow,
    };

    const scrollBarWidth = window.innerWidth - document.body.offsetWidth;
    document.documentElement.style.setProperty(
      '--scrollbar-width',
      `${scrollBarWidth}px`
    );

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'relative';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.removeProperty('--scrollbar-width');

      document.body.style.overflow = original.overflow;
      document.body.style.position = original.position;
      document.body.style.touchAction = original.touchAction;
      document.documentElement.style.overflow = original.htmlOverflow;
    };
  }, [locked]);

  useEffect(() => {
    if (locked !== initialLocked) setLocked(initialLocked);
  }, [initialLocked]);

  return [locked, setLocked];
}
