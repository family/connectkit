import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { isMobile } from '../../../utils';

const mobile = isMobile();

export const AvatarContainer = styled(motion.div)`
  padding: 28px 0 18px;
  ${(props) =>
    mobile &&
    css`
      padding: 6px 0 14px;
    `}
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
