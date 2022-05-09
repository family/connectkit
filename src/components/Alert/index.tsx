import React from 'react';
import { AlertProps } from './types';
import { AlertContainer } from './styles';

const Alert = React.forwardRef(
  ({ children }: AlertProps, ref: React.Ref<HTMLElement>) => {
    return <AlertContainer>{children}</AlertContainer>;
  }
);
Alert.displayName = 'Alert';

export default Alert;
