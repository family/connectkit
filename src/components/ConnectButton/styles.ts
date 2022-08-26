import { motion } from 'framer-motion';
import styled from 'styled-components';

export const TextContainer = styled(motion.div)`
  top: 0;
  bottom: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
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
