import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Arrow = styled.svg`
  position: relative;
  top: -0.5px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 9px;
  margin-right: 1px;
  transition: all 100ms ease;
  transform: translateX(-3px);
`;
export const ArrowChevron = styled.path``;
export const ArrowLine = styled.rect`
  transition: inherit;
  transition-property: transform;
  transform-origin: 90% 50%;
  transform: scaleX(0.1);
`;

export const ButtonContainer = styled.button<{ disabled?: boolean }>`
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

export const IconContainer = styled(motion.div)`
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
    position: absolute;
    inset: 0;
    width: 100%;
    height: auto;
    transform: scale(1.05);
  }
`;
