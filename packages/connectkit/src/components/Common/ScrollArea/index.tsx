import React, { useEffect, useRef } from 'react';
import { ScrollAreaContainer } from './styles';
import useIsMobile from '../../../hooks/useIsMobile';

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

  const isMobile = useIsMobile();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = (e: any) => {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollLeft,
        scrollWidth,
        clientWidth,
      } = e.target;

      if (scrollTop === 0 && scrollLeft === 0) {
        el.classList.add('scroll-start');
      } else {
        el.classList.remove('scroll-start');
      }

      if (
        scrollHeight - scrollTop === clientHeight &&
        scrollWidth - scrollLeft === clientWidth
      ) {
        el.classList.add('scroll-end');
      } else {
        el.classList.remove('scroll-end');
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
      $mobile={isMobile}
      $height={height}
      $backgroundColor={backgroundColor}
      ref={ref}
    >
      {children}
    </ScrollAreaContainer>
  );
};
