
import { motion } from 'framer-motion';
import styled from 'styled-components';

export const BrowserIconContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;