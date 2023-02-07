import { motion } from 'framer-motion';
import styled from './../../../styles/styled';
import { css, keyframes } from 'styled-components';

export const QRCodeContainer = styled(motion.div)`
  z-index: 3;
  position: relative;
  overflow: hidden;
  height: 0;
  padding-bottom: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1px 0 2px;
  border-radius: var(--ck-qr-border-radius, 24px);
  background: var(--ck-qr-background, transparent);
  box-shadow: 0 0 0 1px var(--ck-qr-border-color);
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
  inset: 13px;
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
  --color: var(--ck-qr-dot-color);
  --bg: var(--ck-qr-background, var(--ck-body-background));

  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    z-index: 4;
    position: relative;
    width: 28%;
    height: 28%;
    border-radius: 20px;
    background: var(--bg);
    box-shadow: 0 0 0 7px var(--bg);
  }
  > span {
    z-index: 4;
    position: absolute;
    background: var(--color);
    border-radius: 12px;
    width: 13.25%;
    height: 13.25%;
    box-shadow: 0 0 0 4px var(--bg);
    &:before {
      content: '';
      position: absolute;
      inset: 9px;
      border-radius: 3px;
      box-shadow: 0 0 0 4px var(--bg);
    }
    &:nth-child(1) {
      top: 0;
      left: 0;
    }
    &:nth-child(2) {
      top: 0;
      right: 0;
    }
    &:nth-child(3) {
      bottom: 0;
      left: 0;
    }
  }
  &:before {
    z-index: 3;
    content: '';
    position: absolute;
    inset: 0;
    background: repeat;
    background-size: 1.888% 1.888%;
    background-image: radial-gradient(var(--color) 41%, transparent 41%);
  }
  &:after {
    z-index: 5;
    content: '';
    position: absolute;
    inset: 0;
    transform: scale(1.5) rotate(45deg);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 50%,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0)
    );
    background-size: 200% 100%;
    animation: ${PlaceholderKeyframes} 1000ms linear infinite both;
  }
`;

export const LogoContainer = styled(motion.div)`
  z-index: 6;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateY(50%) scale(0.9999); // Shifting fix
`;
export const LogoIcon = styled(motion.div)<{ $wcLogo?: boolean }>`
  z-index: 6;
  position: absolute;
  left: 50%;
  overflow: hidden;

  transform: translate(-50%, -50%) scale(0.9999); // Shifting fix

  svg {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }

  ${(props) =>
    props.$wcLogo
      ? css`
          width: 29%;
          height: 20.5%;
        `
      : css`
          width: 28%;
          height: 28%;
          border-radius: 17px;
          &:before {
            pointer-events: none;
            z-index: 2;
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.02);
          }
        `}
`;
