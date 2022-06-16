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
    padding: 16px 20px;
    font-size: 16px;
    line-height: 22px;
    margin: -16px 0 12px;
    border-radius: 12px;
    text-align: center;
    background: none;
    box-shadow: 0 0 0 1px var(--body-divider);
  }
`;
