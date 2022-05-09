import React from 'react';

export type ButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  arrow?: boolean;
  href?: string;
  onClick?: (e: any) => void;
};
