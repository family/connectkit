import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

export const ChainContainer = styled.div`
  --bg: transparent;
  --color: #333;
  display: block;
  position: relative;
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--ck-body-background, var(--bg));
  color: var(--ck-body-color-muted, var(--color));
  content: '?';
  font-weight: 500;
  font-family: var(--ck-font-family, inherit);
  pointer-events: none;
  user-select: none;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Spin = keyframes`
  0%{ transform: rotate(0deg); }
  100%{ transform: rotate(360deg); }
`;
export const LoadingContainer = styled(motion.div)`
  animation: ${Spin} 1s linear infinite;
  svg {
    display: block;
    position: absolute;
    inset: 0;
  }
`;
