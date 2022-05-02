import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Button = styled(motion.button)`
  color: var(--body-color);
  background: var(--body-background);
  --outline: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  --shadow: 0 2px 12px rgba(0, 0, 0, 0);
  appearance: none;
  user-select: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  width: 192px;
  max-width: 192px;
  min-width: 192px;
  padding: 6px 13px 6px 6px;
  font-size: 14px;
  font-family: 'LFE';
  font-weight: 500;
  border-radius: 12px;

  will-change: box-shadow, transform;
  transition: box-shadow 100ms ease, transform 100ms ease,
    outline 100ms ease 200ms;

  box-shadow: var(--outline), var(--shadow);

  &:hover {
    --shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }
  &:focus {
    outline: 2px solid var(--family-brand);
  }
  &:active {
    transform: scale(0.98);
  }
  &:hover:focus,
  &:active:focus {
    outline: none;
  }
`;
