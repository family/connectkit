import React from 'react';

export type CustomQRCodeProps = {
  value: string | null;
  image?: React.ReactNode;
  imageBackground?: string;
  imagePosition?: 'center' | 'bottom right';
  tooltipMessage?: React.ReactNode | string;
};
