import React from 'react';
import { InputContainer } from './styles';
import { InputProps } from './types';

const Input: React.FC<InputProps> = ({
  ...props
}) => {
  return (
    <InputContainer
      {...props}
    />
  );
};
export default Input;
