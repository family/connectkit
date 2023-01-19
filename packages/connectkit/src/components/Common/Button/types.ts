import React from 'react';

export type ButtonProps = {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  roundedIcon?: boolean;
  waiting?: boolean;
  arrow?: boolean;
  download?: boolean;
  href?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
};
