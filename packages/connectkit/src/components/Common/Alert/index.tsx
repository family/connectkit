import React from 'react';
import { AlertProps } from './types';
import { AlertContainer, IconContainer } from './styles';

const Alert = React.forwardRef(
  ({ children, icon }: AlertProps, ref: React.Ref<HTMLElement>) => {
    return (
      <AlertContainer>
        {icon && <IconContainer>{icon}</IconContainer>}
        <div>{children}</div>
      </AlertContainer>
    );
  }
);
Alert.displayName = 'Alert';

export default Alert;
