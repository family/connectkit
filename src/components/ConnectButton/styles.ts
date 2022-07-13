import { motion } from 'framer-motion';
import styled from 'styled-components';

export const TextContainer = styled(motion.div)`
  display: block;
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  width: fit-content;
`;

export const Button = styled(motion.button)`
  display: block;
  appearance: none;
  user-select: none;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  height: 42px;
  padding: 0 16px;
  line-height: 0;
  font-size: 15px;
  font-weight: var(--ck-connectbutton-font-weight, 500);
  text-align: center;
  transition: color 100ms ease, background 100ms ease, box-shadow 100ms ease;

  --color: var(--ck-connectbutton-color);
  --background: var(--ck-connectbutton-background);
  --box-shadow: var(--ck-connectbutton-box-shadow);
  --border-radius: var(--ck-connectbutton-border-radius, 14px);

  --hover-color: var(--ck-connectbutton-hover-color, var(--color));
  --hover-background: var(--ck-connectbutton-hover-background, var(--background));
  --hover-box-shadow: var(--ck-connectbutton-hover-box-shadow, var(--box-shadow));
  --hover-border-radius: var(--ck-connectbutton-hover-border-radius, var(--border-radius));

  --active-color: var(--ck-connectbutton-active-color, var(--hover-color));
  --active-background: var(--ck-connectbutton-active-background, var(--hover-background));
  --active-box-shadow: var(--ck-connectbutton-active-box-shadow, var(--hover-box-shadow));
  --active-border-radius: var(--ck-connectbutton-active-border-radius, var(--hover-border-radius));

  color: var(--color);
  background: var(--background);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);

  &:hover {
    color: var(--hover-color);
    background: var(--hover-background);
    box-shadow: var(--hover-box-shadow);
    border-radius: var(--hover-border-radius);
  }
  &:active {
    color: var(--active-color);
    background: var(--active-background);
    box-shadow: var(--active-box-shadow);
    border-radius: var(--active-border-radius);
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
