import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';

import { ModalContent } from '../../Modal/styles';

export const Content = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  left: 0;
  right: 0;
  ${ModalContent} {
    padding: 0 12px 34px;
    gap: 6px;
  }
`;

const dist = 2;
const shakeKeyframes = keyframes`
  0%{ transform:none; }
  25%{ transform:translateX(${dist}px); }
  50%{ transform:translateX(-${dist}px); }
  75%{ transform:translateX(${dist}px); }
  100%{ transform:none; }
`;
const outlineKeyframes = keyframes`
  0%{ opacity:1; }
  100%{ opacity:0; }
`;
export const Container = styled(motion.div)`
  min-width: 100%;
  width: 295px;
`;
export const ConnectingContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px auto 16px;
  height: 120px;
`;
export const ConnectingAnimation = styled(motion.div)<{ status?: string }>`
  position: relative;
  --spinner-error-opacity: 0;
  &:before {
    content: '';
    position: absolute;
    inset: 1px;
    opacity: 0;
    background: var(--body-color-danger);
  }
  ${(props) =>
    props.status === 'failed' &&
    css`
      animation: ${shakeKeyframes} 220ms ease-out both;
      &:before {
        animation: ${outlineKeyframes} 220ms ease-out 750ms both;
      }
    `}
`;

export const LogoContainer = styled(motion.div)`
  z-index: 4;
  position: relative;
  overflow: hidden;
  //background: var(--body-background-secondary);
  svg {
    z-index: 3;
    position: relative;
    display: block;
  }
`;
export const Spinner = styled(motion.div)`
  pointer-events: none;
  user-select: none;
  z-index: 1;
  position: absolute;
  inset: -25%;
  //animation: rotateGradient 600ms ease-out; // extra spin on init
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: conic-gradient(
      from -90deg,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      var(--family-brand)
    );
    animation: rotateGradient 1200ms linear infinite;
  }
  @keyframes rotateGradient {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
export const SpinnerCap = styled(motion.div)`
  z-index: 5;
  position: absolute;
  top: 50%;
  left: 1px;
  right: 50%;
  height: 3px;
  transform-origin: 100% 50%;
  animation: rotateGradient 1200ms linear infinite,
    rotateCap 1200ms ease-in-out infinite;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 3px;
    background: var(--family-brand);
    border-radius: 3px;
  }
  @keyframes rotateCap {
    0%,
    25%,
    50%,
    75%,
    100% {
      left: 0%;
    }
    12.5%,
    37.5%,
    62.5%,
    87.5% {
      left: -7.5%;
    }
  }
`;
export const Logo = styled(motion.div)`
  z-index: 2;
  position: absolute;
  overflow: hidden;
  inset: 6px;
  border-radius: 16px;
  background: var(--body-background-secondary);
  svg,
  img {
    pointer-events: none;
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export const RetryButton = styled(motion.button)`
  z-index: 5;
  appearance: none;
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  cursor: pointer;

  background: var(--body-background-secondary);
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);

  &:hover {
    --background: var(--body-background-secondary-hover);
  }
`;
