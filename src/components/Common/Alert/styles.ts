import { motion } from 'framer-motion';
import styled from 'styled-components';

export const AlertContainer = styled(motion.div)`
  position: relative;
  border-radius: 8px;
  margin: 6px 0 16px;
  padding: 16px 16px;
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
  color: var(--focus-color);

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0.1;
    border-radius: 8px;
  }
`;
