import { motion } from 'framer-motion';
import styled, { css, keyframes } from 'styled-components';

export const QRCodeContainer = styled(motion.div)`
  z-index: 3;
  position: relative;
  overflow: hidden;
  height: 0;
  padding-bottom: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px 0 2px;
  border-radius: 24px;
  background: transparent;
  box-shadow: 0 0 0 1px var(--qr-border-color);
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
  inset: 12px;
  svg {
    width: 100% !important;
    height: auto !important;
  }
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

export const LogoContainer = styled(motion.div)<{
  $position?: 'center' | 'bottom right';
}>`
  z-index: 6;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.$position === 'bottom right'
      ? css`
          right: 0;
          bottom: 0;
          width: 24px;
          height: 24px;
        `
      : css`
          inset: 0;
        `}
`;
export const LogoIcon = styled(motion.div)`
  position: relative;
  width: 28%;
  height: 28%;
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
