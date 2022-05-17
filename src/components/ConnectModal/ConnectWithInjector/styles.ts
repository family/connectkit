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
    padding: 0 8px 38px;
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
  max-width: 100%;
  width: 295px;
  background: var(
    --body-background
  ); // To stop the overlay issue during transition for the spinner
`;
export const ConnectingContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px auto 16px;
  height: 120px;
  //transform: scale(1.001); // fixes shifting issue between states
`;
export const ConnectingAnimation = styled(motion.div)<{
  $shake: boolean | undefined;
}>`
  user-select: none;
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
    props.$shake &&
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
export const Logo = styled(motion.div)`
  z-index: 2;
  position: absolute;
  overflow: hidden;
  inset: 6px;
  border-radius: 18px;
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
  overflow: hidden;
  background: none;

  color: var(--body-background-secondary);
  transition: color 200ms ease;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);

  &:hover {
    color: var(--body-background-secondary-hover);
  }
`;
export const RetryIconContainer = styled(motion.div)`
  position: absolute;
  inset: 0;

  &:before {
    z-index: 1;
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 16px;
    background: conic-gradient(
      from 90deg,
      currentColor 10%,
      var(--body-color) 80%
    );
  }

  svg {
    z-index: 2;
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }
`;
export const SpinnerContainer = styled(motion.div)`
  position: absolute;
  inset: 1px;
  overflow: hidden;
`;
export const ExpiringSpinner = styled(motion.div)`
  pointer-events: none;
  user-select: none;
  z-index: 1;
  position: absolute;
  inset: -25%;
  background: var(--body-background-secondary);
  div:first-child {
    position: absolute;
    left: 50%;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    &:before {
      position: absolute;
      content: '';
      inset: 0;
      background: var(--spinner-color);
      transform-origin: 0% 50%;
      animation: rotateExpiringSpinner 5000ms ease-in both;
    }
  }
  div:last-child {
    position: absolute;
    left: 0;
    right: 50%;
    top: 0;
    bottom: 0;
    overflow: hidden;
    &:before {
      position: absolute;
      content: '';
      inset: 0;
      background: var(--spinner-color);
      transform-origin: 100% 50%;
      animation: rotateExpiringSpinner 5000ms ease-out 5000ms both;
    }
  }
  @keyframes rotateExpiringSpinner {
    0% {
      transform: rotate(-180deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;
export const Spinner = styled(motion.div)`
  pointer-events: none;
  user-select: none;
  z-index: 1;
  position: absolute;
  inset: -25%;
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
      var(--spinner-color)
    );
    animation: rotateSpinner 1200ms linear infinite;
  }
  @keyframes rotateSpinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
