import styled from 'styled-components';
import { motion } from 'framer-motion';

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
    z-index: 1;
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
  box-shadow: 0 1px 0 0 var(--body-divider);
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

export const BackgroundOverlay = styled(motion.div)`
  z-index: 1;
  position: absolute;
  inset: 0;
  background: var(--overlay-background);
`;

export const Container = styled(motion.div)`
  z-index: 2;
  position: relative;
  width: auto;
  max-width: 90vw;
  color: var(--body-color);
  //background: var(--body-background);
  //box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  &:before {
    z-index: 1;
    pointer-events: none;
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--body-background);
    will-change: transform;
    transform: translateZ(0);
  }
`;
export const Content = styled(motion.div)`
  position: relative;
  z-index: 2;
`;
export const InnerContainer = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: height 220ms ease, width 220ms ease;
  //will-change: height, width;
`;
export const PageContainer = styled(motion.div)`
  width: fit-content;
  padding: 24px 24px;
`;

export const ModalContainer = styled(motion.div)`
  z-index: 2147483646; // z-index set one below max (2147483647) for if we wish to layer things ontop of the modal in a seperate Portal
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
  border-radius: 14px;
  padding: 0;
  margin: 0;
  color: var(--body-action-color);
  background: var(--body-background);
  will-change: background-color, transform;
  transition: background-color 200ms ease, transform 100ms ease;
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
  border-radius: 14px;
  padding: 0;
  margin: 0;
  color: var(--body-action-color);
  background: var(--body-background);
  will-change: background-color, transform;
  transition: background-color 200ms ease, transform 100ms ease;
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
  border-radius: 14px;
  padding: 0;
  margin: 0;
  color: var(--body-action-color);
  background: var(--body-background);
  will-change: background-color, transform;
  transition: background-color 200ms ease, transform 100ms ease;
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
