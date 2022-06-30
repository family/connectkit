import { useEffect, useState, useLayoutEffect } from 'react';
import { useContext } from '../components/ConnectKit';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function useLockBodyScroll(initialLocked: boolean) {
  const [locked, setLocked] = useState(initialLocked);

  const context = useContext();

  useIsomorphicLayoutEffect(() => {
    if (!locked) return;

    const original = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      touchAction: document.body.style.touchAction,
      paddingRight: document.body.style.paddingRight,
      //htmlOverflow: document.documentElement.style.overflow,
    };

    const style = getComputedStyle(document.body);
    const offsetX =
      parseInt(style.marginRight) +
      parseInt(style.paddingRight) +
      parseInt(style.borderRight) +
      parseInt(style.marginLeft) +
      parseInt(style.paddingLeft) +
      parseInt(style.borderLeft);

    const scrollBarWidth =
      window.innerWidth - document.body.offsetWidth - offsetX;
    document.documentElement.style.setProperty(
      '--ck-scrollbar-width',
      `${scrollBarWidth}px`
    );

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'relative';
    document.body.style.touchAction = 'none';
    //document.documentElement.style.overflow = 'hidden'; // overflow:hidden; on <html> breaks position:sticky;
    if (context.options?.avoidLayoutShift) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.documentElement.style.removeProperty('--ck-scrollbar-width');

      document.body.style.overflow = original.overflow;
      document.body.style.position = original.position;
      document.body.style.touchAction = original.touchAction;
      //document.documentElement.style.overflow = original.htmlOverflow;
      if (context.options?.avoidLayoutShift) {
        document.body.style.paddingRight = original.paddingRight;
      }
    };
  }, [locked]);

  useEffect(() => {
    if (locked !== initialLocked) setLocked(initialLocked);
  }, [initialLocked]);

  return [locked, setLocked];
}
