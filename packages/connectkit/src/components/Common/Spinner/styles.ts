import { motion } from 'framer-motion';
import styled from './../../../styles/styled';
import { keyframes } from 'styled-components';

const Spin = keyframes`
  0%{ transform: rotate(0deg); }
  100%{ transform: rotate(360deg); }
`;
export const SpinnerContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${Spin} 1s linear infinite;
  svg {
    display: block;
    position: relative;
    animation: ${Spin} 1s ease-in-out infinite;
  }
`;
