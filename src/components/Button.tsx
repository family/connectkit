import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const ButtonContainer = styled(motion.button)`
  --background: var(--body-background-secondary);
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
  margin: 12px 0 0;
  padding: 0 32px;
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  color: var(--body-color);
  background: var(--background);
  white-space: nowrap;
  transition: box-shadow 100ms ease, background-color 100ms ease;
  box-shadow: 0 0 0 0 var(--background);

  &:hover {
    --background: var(--body-background-secondary-hover);
    box-shadow: 0 0 0 2px var(--background);
  }
  &:active {
    box-shadow: 0 0 0 1px var(--background);
  }
`;

const IconContainer = styled(motion.div)`
  display: block;
  position: relative;
  overflow: hidden;
  border-radius: 4.5px;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

type ButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  arrow?: boolean;
  onClick?: (e: any) => void;
};
const Button = React.forwardRef(
  (
    { children, disabled, icon, arrow, onClick }: ButtonProps,
    ref: React.Ref<HTMLElement>
  ) => {
    return (
      <ButtonContainer
        onClick={(event: any) => {
          if (!disabled && onClick) onClick(event);
        }}
        disabled={disabled}
      >
        {icon && <IconContainer>{icon}</IconContainer>}
        {children}
        {arrow && <></>}
      </ButtonContainer>
    );
  }
);
Button.displayName = 'Button';

export default Button;
