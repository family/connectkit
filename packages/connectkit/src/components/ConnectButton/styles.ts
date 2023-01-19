import { motion } from 'framer-motion';
import styled from './../../styles/styled';

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
`;

export const UnsupportedNetworkContainer = styled(motion.div)`
  z-index: 1;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.02);
  background: var(--ck-body-color-danger, red);
  color: #fff;
  svg {
    display: block;
    position: relative;
    top: -1px;
  }
`;
