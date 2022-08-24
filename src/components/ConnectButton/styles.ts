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

export const ChainContainer = styled(motion.div)`
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  svg {
    display: block;
  }
`;
export const IconContainer = styled(motion.div)`
  pointer-events: none;
  user-select: none;
  position: relative;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  svg {
    position: absolute;
    inset: 0;
  }
`;
