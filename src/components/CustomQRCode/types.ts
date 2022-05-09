import React from 'react';

export type CustomQRCodeProps = {
  value: string | null;
  image?: React.ReactNode;
  tooltipMessage?: React.ReactNode | string;
};
