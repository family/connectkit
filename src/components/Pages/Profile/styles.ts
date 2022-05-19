import styled from 'styled-components';
import { motion } from 'framer-motion';

export const AvatarContainer = styled(motion.div)`
  padding: 28px 0 18px;
`;
export const AvatarInner = styled(motion.div)`
  position: relative;
  display: inline-block;
`;
export const ChainSelectorContainer = styled(motion.div)`
  z-index: 3;
  position: absolute;
  bottom: 0px;
  right: -16px;
`;
