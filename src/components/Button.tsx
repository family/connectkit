import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const ButtonContainer = styled(motion.button)`
  appearance: none;
  cursor: pointer;
  user-select: none;
  min-width: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  height: 48px;
  margin: 24px 0 0;
  padding: 0 32px;
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  background: var(--family-brand);
  box-shadow: 0px 2px 8px rgba(118, 123, 235, 0.2);
  white-space: nowrap;
  will-change: transform;
  transition: transform 100ms ease;

  &:hover {
    transform: scale(1.01);
  }
  &:active {
    transform: scale(0.99);
  }
`;

type ButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: (e: any) => void;
};
const Button = React.forwardRef(
  (
    { children, disabled, onClick }: ButtonProps,
    ref: React.Ref<HTMLElement>
  ) => {
    return (
      <ButtonContainer
        onClick={(event: any) => {
          if (!disabled && onClick) onClick(event);
        }}
        disabled={disabled}
      >
        {children}
      </ButtonContainer>
    );
  }
);
Button.displayName = 'Button';

export default Button;
