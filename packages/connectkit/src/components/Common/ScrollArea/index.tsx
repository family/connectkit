import React, { useEffect, useRef } from 'react';
import { ScrollAreaContainer } from './styles';

export const ScrollArea = ({
  children,
  height,
  backgroundColor,
}: {
  children: React.ReactNode;
  height?: number;
  backgroundColor?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // if scroll at top add class, if scroll at bottom add class
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = (e: any) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollTop === 0) {
        el.classList.add('scroll-top');
      } else {
        el.classList.remove('scroll-top');
      }

      if (scrollHeight - scrollTop === clientHeight) {
        el.classList.add('scroll-bottom');
      } else {
        el.classList.remove('scroll-bottom');
      }
    };

    el.addEventListener('scroll', handleScroll);
    handleScroll({ target: el });

    return () => {
      el.removeEventListener('scroll', handleScroll);
    };
  }, [ref.current]);

  return (
    <ScrollAreaContainer
      $height={height}
      $backgroundColor={backgroundColor}
      ref={ref}
    >
      {children}
    </ScrollAreaContainer>
  );
};
