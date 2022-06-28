import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import defaultTheme from '../../../constants/defaultTheme';

const FadeIn = keyframes`
from { opacity: 0; }
  to { opacity: 1; }
`;

const FadeInScaleUp = keyframes`
from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
`;

const FadeInScaleDown = keyframes`
from { opacity: 0; transform: scale(1.1); }
  to { opacity: 1; transform: scale(1); }
`;

const FadeOut = keyframes`
from { opacity: 1; }
  to { opacity: 0; }
`;

const FadeOutScaleUp = keyframes`
from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(1.1); }
`;

const FadeOutScaleDown = keyframes`
from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.85); }
`;

export const PageContent = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;

export const TextWithHr = styled(motion.div)`
  user-select: none;
  position: relative;
  display: block;
  text-align: center;
  color: var(--body-color-muted);
  font-size: 15px;
  font-weight: 400;
  line-height: 21px;
  span {
    z-index: 2;
    position: relative;
    display: inline-block;
    padding: 0 14px;
    background: var(--body-background);
  }
  &:before {
    z-index: 2;
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    transform: translateY(-1px);
    background: var(--body-divider);
    box-shadow: var(--body-divider-box-shadow);
  }
`;
export const ModalHeading = styled(motion.div)`
  z-index: 3;
  pointer-events: none;
  user-select: none;
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  width: var(--width);
  text-align: center;
  font-size: 17px;
  line-height: 20px;
  font-weight: var(--ck-modal-heading-font-weight, 600);
  color: var(--body-color);
`;

export const ModalHeadingBlock = styled(motion.div)`
  height: 48px;
`;

export const ModalContentContainer = styled(motion.div)`
  position: relative;
  padding: 0;
`;
export const ModalContent = styled(motion.div)`
  left: 0;
  right: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 0 16px;
`;
export const ModalH1 = styled(motion.h1)<{
  $error?: boolean;
  $valid?: boolean;
  $small?: boolean;
}>`
  margin: 0;
  padding: 0;
  line-height: ${(props) => (props.$small ? 20 : 22)}px;
  font-size: ${(props) => (props.$small ? 17 : 19)}px;
  font-weight: var(--ck-modal-h1-font-weight, 600);
  color: ${(props) => {
    if (props.$error) return 'var(--body-color-danger)';
    if (props.$valid) return 'var(--body-color-valid)';
    return 'var(--body-color)';
  }};
  > svg {
    position: relative;
    top: -2px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    font-size: 17px;
  }
`;

export const ModalBody = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  color: var(--body-color-muted);
  strong {
    font-weight: 500;
    color: var(--body-color);
  }
`;

export const ModalBodySmall = styled.div`
  padding: 0 12px;
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
  color: var(--body-color-muted);
  strong {
    font-weight: 500;
    color: var(--body-color);
  }
`;

export const BackgroundOverlay = styled(motion.div)<{ $active: boolean }>`
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--overlay-background);
  opacity: 0;
  animation: ${(props) => (props.$active ? FadeIn : FadeOut)} 150ms ease-out
    both;
`;

const BoxIn = keyframes`
  from{ opacity: 0; transform: scale(0.97); }
  to{ opacity: 1; transform: scale(1); }
`;
const BoxOut = keyframes`
  from{ opacity: 1; transform: scale(1); }
  to{ opacity: 0; transform: scale(0.97); }
`;

const MobileBoxIn = keyframes`
  from { transform: translate3D(0, 100%, 0); }
  to { transform: translate3D(0, 0%, 0); }
`;

const MobileBoxOut = keyframes`
  from { transform: translate3D(0, 0%, 0); }
  to { transform: translate3D(0, 110%, 0); } // a bit further to avoid dropshadow peaking out
`;

export const BoxContainer = styled(motion.div)`
  z-index: 2;
  position: relative;
  color: var(--body-color);

  animation: 150ms ease both;
  animation-name: ${BoxOut};
  &.active {
    animation-name: ${BoxIn};
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    backface-visibility: hidden;
    width: var(--width);
    height: var(--height);
    background: var(--body-background);
    transition: all 0.2s ease;
    border-radius: var(--border-radius, 20px);
    box-shadow: var(--ck-modal-box-shadow);
  }

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    animation-name: ${MobileBoxOut};
    animation-duration: 320ms;
    animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);

    &.active {
      animation-name: ${MobileBoxIn};
      animation-duration: 400ms;
      animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
    }

    &:before {
      transition-duration: 200ms;
      width: 100%;
    }
  }
`;
export const ControllerContainer = styled(motion.div)`
  z-index: 3;
  position: absolute;
  top: 0;
  left: 50%;
  height: 64px;
  transform: translateX(-50%);
  backface-visibility: hidden;
  width: var(--width);
  transition: 0.2s ease width;
  pointer-events: auto;
  //border-bottom: 1px solid var(--body-divider);
`;

export const InnerContainer = styled(motion.div)`
  position: relative;
  overflow: hidden;
  height: var(--height);
  transition: 0.2s ease height;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    transition-duration: 200ms;
  }
`;

export const PageContainer = styled(motion.div)`
  z-index: 2;
  position: relative;
  top: 0;
  left: 50%;
  margin-left: calc(var(--width) / -2);
  width: var(--width);
  /* left: 0; */
  /* width: 100%; */
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: center center;
  animation: 200ms ease both;

  &.active {
    animation-name: ${FadeInScaleDown};
  }
  &.active-scale-up {
    animation-name: ${FadeInScaleUp};
  }
  &.exit-scale-down {
    z-index: 1;
    pointer-events: none;
    position: absolute;
    /* top: 0; */
    /* left: 0; */
    animation-name: ${FadeOutScaleDown};
  }
  &.exit {
    z-index: 1;
    pointer-events: none;
    position: absolute;
    /* top: 0; */
    /* left: 0; */
    /* left: 50%; */
    /* transform: translateX(-50%); */
    animation-name: ${FadeOutScaleUp};
    animation-delay: 16.6667ms;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    &.active {
      animation-name: ${FadeIn};
    }
    &.active-scale-up {
      animation-name: ${FadeIn};
    }
    &.exit-scale-down {
      animation-name: ${FadeOut};
    }
    &.exit {
      animation-name: ${FadeOut};
    }
  }
`;
export const PageContents = styled(motion.div)`
  margin: 0 auto;
  width: fit-content;
  padding: 29px 24px 24px;
  backface-visibility: hidden;
`;

export const ModalContainer = styled.div`
  z-index: 2147483646; // z-index set one below max (2147483647) for if we wish to layer things ontop of the modal in a seperate Portal
  position: fixed;
  inset: 0;
`;

export const CloseButton = styled(motion.button)`
  z-index: 3;
  cursor: pointer;
  position: absolute;
  top: 22px;
  right: 17px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 0;
  margin: 0;
  color: var(--body-action-color);
  background: var(--body-background);
  transition: background-color 200ms ease, transform 100ms ease;
  will-change: transform;
  svg {
    display: block;
  }

  &:hover {
    background: var(--body-background-secondary);
  }
  &:active {
    transform: scale(0.9);
  }
`;

export const BackButton = styled(motion.button)`
  z-index: 3;
  position: absolute;
  top: 23px;
  left: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 0;
  margin: 0;
  color: var(--body-action-color);
  background: var(--body-background);
  transition: background-color 200ms ease, transform 100ms ease;
  will-change: transform;
  svg {
    display: block;
    position: relative;
    left: -1px;
  }

  &:enabled {
    cursor: pointer;
    &:hover {
      background: var(--body-background-secondary);
    }
    &:active {
      transform: scale(0.9);
    }
  }
`;

export const InfoButton = styled(motion.button)`
  z-index: 3;
  position: absolute;
  top: 23px;
  left: 21px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 0;
  margin: 0;
  color: var(--body-action-color);
  background: var(--body-background);
  transition: background-color 200ms ease, transform 100ms ease;
  will-change: transform;
  svg {
    display: block;
    position: relative;
  }
  &:enabled {
    cursor: pointer;
    &:hover {
      background: var(--body-background-secondary);
    }
    &:active {
      transform: scale(0.9);
    }
  }
`;

export const Container = styled(motion.div)`
  --ease: cubic-bezier(0.25, 0.1, 0.25, 1);
  --duration: 200ms;
  --transition: height var(--duration) var(--ease),
    width var(--duration) var(--ease);
  z-index: 3;
  display: block;
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  transform: translate3d(-50%, -50%, 0);
  backface-visibility: hidden;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    pointer-events: auto;
    left: 0;
    top: auto;
    bottom: -5px;
    transform: none;
    ${BoxContainer} {
      max-width: 448px;
      margin: 0 auto;
      &:before {
        width: 100%;
        border-radius: 30px 30px 0 0;
      }
    }
    ${PageContainer} {
      left: 0;
      right: 0;
      margin: 0 auto;
      width: auto;
    }
    ${PageContent} {
      margin: 0 auto;
      width: 100% !important;
    }
    ${ModalHeading} {
      top: 32px;
    }
    ${ModalContent} {
      gap: 12px;
    }
    ${ModalBody} {
      margin: 0 auto;
      max-width: 295px;
    }
    ${PageContents} {
      width: 100%;
      padding: 31px 24px;
    }
    ${ControllerContainer} {
      width: 100%;
      top: 4px;
      border-bottom: 0;
    }
    ${CloseButton} {
      right: 22px;
    }
    ${BackButton} {
      top: 22px;
      left: 17px;
    }
    ${InfoButton} {
      top: 25px;
      left: 23px;
      width: 26px;
      height: 26px;
      svg {
        width: 100%;
        height: auto;
      }
    }
  }
`;
