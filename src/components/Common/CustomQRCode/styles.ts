import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

export const QRCodeContainer = styled(motion.div)`
  z-index: 3;
  position: relative;
  overflow: hidden;
  height: 0;
  padding-bottom: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px 0 6px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 0 0 1px var(--qrcode-outline);
  backface-visibility: hidden;
  svg {
    display: block;
    max-width: 100%;
    width: 100%;
    height: auto;
  }
`;
export const QRCodeContent = styled(motion.div)`
  position: absolute;
  inset: 14px;
`;
export const PlaceholderKeyframes = keyframes`
  0%{ background-position: 100% 0; }
  100%{ background-position: -100% 0; }
`;
export const QRPlaceholder = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /*
  &:before {
    z-index: 4;
    content: '';
    position: absolute;
    inset: 0;
    transform: scale(1.5) rotate(45deg);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 50%,
      rgba(0, 0, 0, 0.1),
      rgba(255, 255, 255, 0)
    );
    opacity: 0.75;
    background-size: 200% 100%;
    animation: ${PlaceholderKeyframes} 1000ms linear infinite both;
  }
  */
`;

export const LogoContainer = styled(motion.div)`
  z-index: 6;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const LogoIcon = styled(motion.div)`
  position: relative;
  width: 25.7%;
  height: 25.7%;
  border-radius: 17px;
  overflow: hidden;
  &:before {
    pointer-events: none;
    z-index: 2;
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.02);
  }
  svg {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }
`;
