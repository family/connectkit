import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Arrow = styled.svg`
  position: relative;
  top: -0.5px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 9px;
  margin-right: 1px;
  transition: all 100ms ease;
  transform: translateX(-3px);
`;
const ArrowChevron = styled.path``;
const ArrowLine = styled.rect`
  transition: inherit;
  transition-property: transform;
  transform-origin: 90% 50%;
  transform: scaleX(0.1);
`;

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
    ${Arrow} {
      transform: translateX(0);
      ${ArrowLine} {
        transform: none;
      }
      ${ArrowChevron} {
      }
    }
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
