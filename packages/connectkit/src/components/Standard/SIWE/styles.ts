import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const Spin = keyframes`
  0%{ transform: rotate(0deg); }
  100%{ transform: rotate(360deg); }
`;
export const SpinnerContainer = styled(motion.div)`
  position: relative;
  animation: ${Spin} 1s linear infinite;
  svg {
    display: block;
    position: relative;
    animation: ${Spin} 1s ease-in-out infinite;
  }
`;
