import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
  backface-visibility: hidden;
`;
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
