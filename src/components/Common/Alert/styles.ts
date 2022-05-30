import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { isMobile } from '../../../utils';

const mobile = isMobile();

export const AlertContainer = styled(motion.div)`
  position: relative;
  border-radius: 9px;
  margin: 8px 0;
  padding: 10px 12px;
  text-align: left;
  font-size: 14px;
  line-height: 17px;
  font-weight: 400;
  color: var(--text-muted);
  background: var(--tooltip-background-secondary);
  ${() =>
    mobile &&
    css`
      padding: 16px 20px;
      font-size: 16px;
      line-height: 22px;
      margin: 12px 0;
      border-radius: 12px;
    `}
`;
