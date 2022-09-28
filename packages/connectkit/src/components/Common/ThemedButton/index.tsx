import React from 'react';

import { ThemeContainer, Container } from './styles';

import { All } from './../../../types';
import useMeasure from 'react-use-measure';

type ThemedButtonProps = {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  autoSize?: boolean;
  duration?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export const PlaceholderButton = () => {
  return <div style={{ height: 40 }} />;
};

const ThemedButton: React.FC<ThemedButtonProps & All> = ({
  children,
  variant = 'primary',
  autoSize = true,
  duration = 0.3,
  style,
}) => {
  const [contentRef, bounds] = useMeasure();
  return (
    <Container
      className={variant}
      initial={false}
      animate={
        autoSize
          ? {
              width: bounds.width > 10 ? bounds.width : 'auto',
            }
          : undefined
      }
      transition={{
        duration: duration,
        ease: [0.25, 1, 0.5, 1],
        delay: 0.01,
      }}
      style={style}
    >
      <div
        ref={contentRef}
        style={{
          whiteSpace: 'nowrap',
          width: 'fit-content',
          position: 'relative',
          padding: '0 12px',
        }}
      >
        {children}
      </div>
    </Container>
  );
};
export default ThemedButton;
export { ThemeContainer };
