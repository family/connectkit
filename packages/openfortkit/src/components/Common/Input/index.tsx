import React from 'react';
import { EyeIcon, EyeOffIcon } from '../../../assets/icons';
import { IconButton, InputContainer, Input as StyledInput } from './styles';
import { InputProps } from './types';

const PasswordInput: React.FC<InputProps> = ({
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <InputContainer>
      <StyledInput
        {...props}
        style={{ paddingRight: '48px', ...props.style }}
        type={showPassword ? 'text' : 'password'}
      />
      <IconButton
        type='button'
        onClick={() => setShowPassword(!showPassword)}
      >
        {
          showPassword ?
            <EyeIcon /> :
            <EyeOffIcon />
        }
      </IconButton>
    </InputContainer>
  );
};

const Input: React.FC<InputProps> = ({
  ...props
}) => {
  if (props.type === 'password')
    return <PasswordInput {...props} />;

  return (
    <InputContainer>
      <StyledInput
        {...props}
      />
    </InputContainer>
  );
};

export default Input;
