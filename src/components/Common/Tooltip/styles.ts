import { motion } from 'framer-motion';
import styled from 'styled-components';
import { TooltipSizeProps } from './types';

export const TooltipWindow = styled(motion.div)`
  z-index: 2147483647;
  position: fixed;
  inset: 0;
  pointer-events: none;
`;
export const TooltipContainer = styled(motion.div)<{ $size: TooltipSizeProps }>`
  --shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
  z-index: 2147483647;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  gap: 8px;
  width: fit-content;
  max-width: 268px;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => (props.$size === 'small' ? 11 : 14)}px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 19px;
  font-weight: 500;
  color: var(--tooltip-color);
  background: var(--tooltip-background);
  box-shadow: var(--shadow);
  > span {
    z-index: 3;
    position: relative;
  }
  > div {
    margin: -4px 0; // offset for icon
  }
  strong {
    color: var(--spinner-color);
  }
`;

export const TooltipTail = styled(motion.div)<{ $size: TooltipSizeProps }>`
  z-index: 2;
  position: absolute;
  width: ${(props) => (props.$size === 'small' ? 14 : 18)}px;
  height: ${(props) => (props.$size === 'small' ? 14 : 18)}px;
  background: inherit;
  margin: 0;
  border-radius: ${(props) => (props.$size === 'small' ? 2 : 3)}px 0 0 0;
  right: 100%;
  margin: 0 !important;
  top: 50%;
  transform: translate(75%, -50%) rotate(-45deg);
  //box-shadow: var(--shadow);
`;
