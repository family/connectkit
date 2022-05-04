import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const ButtonContainer = styled.button<{ disabled?: boolean }>`
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
  text-decoration: none;
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
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4.5px;
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  margin-right: 10px;
  svg {
    display: block;
    max-width: 95%;
    height: auto;
  }
`;

type ButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  arrow?: boolean;
  href?: string;
  onClick?: (e: any) => void;
};
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
      {arrow && <></>}
    </ButtonContainer>
  );
};
export default Button;
