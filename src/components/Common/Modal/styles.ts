import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { isMobile } from '../../../utils';

const mobile = isMobile();

const FadeIn = keyframes`
from{ opacity: 0; }
  to{ opacity: 1; }
`;
const FadeOut = keyframes`
  from{ opacity: 1; }
  to{ opacity: 0; }
`;

export const PageContent = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;

export const TextWithHr = styled(motion.div)`
  position: relative;
  display: block;
  text-align: center;
  color: var(--body-color-muted);
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  span {
    z-index: 2;
    position: relative;
    display: inline-block;
    padding: 0 16px;
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
    transform: translateY(1px);
    background: var(--body-divider);
  }
`;
export const ModalHeading = styled(motion.div)`
  text-align: center;
  font-size: 17px;
  line-height: 20px;
  font-weight: 600;
  color: var(--body-color);
  padding: 0 0 20px;
  margin: 0 -24px 24px;
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
  gap: 6px;
  padding: 0 0 16px;
`;
export const ModalH1 = styled(motion.h1)<{
  $error?: boolean;
  $valid?: boolean;
}>`
  margin: 0;
  padding: 0;
  font-size: 19px;
  font-weight: 600;
  line-height: 24px;
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
`;
export const ModalBody = styled(motion.div)`
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
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
  from{ opacity: 1; transform: translateY(100%); }
  to{ opacity: 1; transform: translateY(0%); }
`;
const MobileBoxOut = keyframes`
  from{ opacity: 1; transform: translateY(0%); }
  to{ opacity: 1; transform: translateY(100%); }
`;
export const BoxContainer = styled(motion.div)`
  z-index: 2;
  position: relative;
  color: var(--body-color);

  animation: 150ms ease-out both;
  animation-name: ${BoxOut};
  &.active {
    animation-name: ${BoxIn};
  }

  &.mobile {
    animation-name: ${MobileBoxOut};
    &.active {
      animation-name: ${MobileBoxIn};
    }
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
    border-radius: calc(var(--border-radius) * 1px);
    background: var(--body-background);
    transition: var(--transition);
    will-change: width;
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
  transition: var(--transition);
  pointer-events: auto;
  border-bottom: 1px solid var(--body-divider);
`;
export const InnerContainer = styled(motion.div)`
  position: relative;
  overflow: hidden;
  height: var(--height);
  transition: var(--transition);
  will-change: height, width;
`;
export const PageContainer = styled(motion.div)`
  z-index: 2;
  position: relative;
  top: 0;
  width: 100%;
  &.active {
    animation: ${FadeIn} 165ms ease 55ms both;
  }
  &.exit {
    z-index: 1;
    pointer-events: none;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    animation: ${FadeOut} 165ms ease both;
  }
`;
export const PageContents = styled(motion.div)`
  margin: 0 auto;
  width: fit-content;
  padding: 24px 24px;
  backface-visibility: hidden;
`;

export const ModalContainer = styled(motion.div)`
  z-index: 2147483646; // z-index set one below max (2147483647) for if we wish to layer things ontop of the modal in a seperate Portal
  position: fixed;
  inset: 0;
`;

export const CloseButton = styled(motion.button)`
  z-index: 3;
  cursor: pointer;
  position: absolute;
  top: 18px;
  right: 16px;
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
  cursor: pointer;
  position: absolute;
  top: 18px;
  left: 14px;
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

  &:hover {
    background: var(--body-background-secondary);
  }
  &:active {
    transform: scale(0.9);
  }
`;

export const InfoButton = styled(motion.button)`
  z-index: 3;
  cursor: pointer;
  position: absolute;
  top: 18px;
  left: 18px;
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

  &:hover {
    background: var(--body-background-secondary);
  }
  &:active {
    transform: scale(0.9);
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
  ${() =>
    mobile &&
    css`
      pointer-events: auto;
      left: 0;
      top: auto;
      bottom: -5px;
      transform: none;
      ${BoxContainer} {
        max-width: 448px;
        margin: 0 auto;
        &:before {
          border-radius: 30px 30px 0 0;
        }
      }
      ${PageContent} {
        margin: 0 auto;
        width: 100% !important;
      }
      ${ModalHeading} {
        margin: 0 0 20px;
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
        padding: 32px 24px;
      }
      ${ControllerContainer} {
        top: 8px;
        border-bottom: 0;
      }
      ${CloseButton} {
        right: 22px;
      }
      ${BackButton} {
        left: 17px;
      }
      ${InfoButton} {
        top: 21px;
        left: 24px;
        width: 26px;
        height: 26px;
        svg {
          width: 100%;
          height: auto;
        }
      }
    `}
`;
