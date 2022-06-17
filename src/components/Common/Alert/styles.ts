import styled from 'styled-components';
import { motion } from 'framer-motion';
import defaultTheme from '../../../constants/defaultTheme';

export const AlertContainer = styled(motion.div)`
  position: relative;
  border-radius: 9px;
  margin: -10px 0 8px;
  padding: 10px 12px;
  text-align: left;
  font-size: 14px;
  line-height: 17px;
  font-weight: 400;
  color: var(--body-color-muted);
  background: var(--tooltip-background-secondary);
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    padding: 16px 32px;
    font-size: 16px;
    line-height: 21px;
    margin: 0 4px -2px;
    border-radius: 24px;
    text-align: center;
  }
`;
