import React from 'react';
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
  return (
    <ScrollAreaContainer $height={height} $backgroundColor={backgroundColor}>
      {children}
    </ScrollAreaContainer>
  );
};
