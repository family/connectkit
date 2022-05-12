import { motion } from 'framer-motion';
import styled from 'styled-components';

export const TextContainer = styled(motion.div)`
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`;

export const Button = styled(motion.button)`
  --outline: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  color: var(--connectbutton-color);
  background: var(--connectbutton-background);
  appearance: none;
  user-select: none;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  height: 40px;
  padding: 0 15px;
  line-height: 0;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;

  will-change: background-color, transform;
  transition: background-color 100ms ease, transform 100ms ease;

  box-shadow: var(--outline), var(--shadow);

  &:hover {
    background: var(--connectbutton-background-hover);
  }
  &:active {
    transform: scale(0.98);
    background: var(--connectbutton-background-active);
  }
  &:focus-visible {
    outline: 2px solid var(--family-brand);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.3;
  }
`;

export const IconContainer = styled(motion.div)`
  pointer-events: none;
  user-select: none;
  position: relative;
  width: 24px;
  height: 24px;
  margin-left: -4px;
  margin-right: 10px;
  svg {
    position: absolute;
    inset: 0;
  }
`;
