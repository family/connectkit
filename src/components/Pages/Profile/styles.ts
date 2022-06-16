import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import defaultTheme from '../../../constants/defaultTheme';

export const AvatarContainer = styled(motion.div)`
  padding: 20px 0 16px;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    padding: 6px 0 14px;
  }
`;
export const AvatarInner = styled(motion.div)`
  position: relative;
  display: inline-block;
`;
export const ChainSelectorContainer = styled(motion.div)`
  z-index: 3;
  position: absolute;
  bottom: 0px;
  right: -15px;
`;

export const BalanceContainer = styled(motion.div)`
  position: relative;
`;
export const Balance = styled(motion.div)`
  position: relative;
`;
const PlaceholderKeyframes = keyframes`
  0%{ background-position: 100% 0; }
  100%{ background-position: -100% 0; }
`;
export const LoadingBalance = styled(motion.div)`
  width: 25%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background: var(--body-background-secondary);
  inset: 0;
  &:before {
    z-index: 4;
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
      90deg,
      var(--body-background-transparent) 50%,
      var(--body-background),
      var(--body-background-transparent)
    );
    opacity: 0.75;
    background-size: 200% 100%;
    animation: ${PlaceholderKeyframes} 1000ms linear infinite both;
  }
`;
