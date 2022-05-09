import React from 'react';
import { ButtonProps } from './types';
import {
  ButtonContainer,
  IconContainer,
  Arrow,
  ArrowLine,
  ArrowChevron,
} from './styles';

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  icon,
  arrow,
  href,
  onClick,
}) => {
  return (
    <ButtonContainer
      as={href ? 'a' : undefined}
      onClick={(event: any) => {
        if (!disabled && onClick) onClick(event);
      }}
      href={href}
      target={href && '_blank'}
      rel={href && 'noopener noreferrer'}
      disabled={disabled}
    >
      {icon && <IconContainer>{icon}</IconContainer>}
      {children}
      {arrow && (
        <Arrow width="11" height="10" viewBox="0 0 11 10">
          <ArrowLine
            y="4.25"
            width="10.5"
            height="1.5"
            rx="0.75"
            fill="currentColor"
          />
          <ArrowChevron
            d="M5.75 1L9.75 5L5.75 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Arrow>
      )}
    </ButtonContainer>
  );
};
export default Button;
