import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ModalHeading = styled(motion.div)`
  text-align: center;
  font-size: 17px;
  line-height: 20px;
  font-weight: 600;
  color: var(--body-color);
  padding: 0 0 20px;
  margin: 0 -16px 0;
  box-shadow: 0 1px 0 0 var(--body-divider);
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
  background: var(--body-background);
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 18px;

  &,
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
      'Apple Color Emoji', Arial, sans-serif, 'Segoe UI Emoji',
      'Segoe UI Symbol';
    font-weight: 500;
    box-sizing: border-box;
  }
`;
export const InnerContainer = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: height 220ms ease, width 220ms ease;
  //transition-delay: 45ms; // stops weird shifting
  will-change: height, width;
`;
export const PageContainer = styled(motion.div)`
  width: fit-content;
  padding: 24px 16px;
`;

export const ModalContainer = styled(motion.div)`
  z-index: 2147483647;
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
  right: 22px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  cursor: pointer;
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
  left: 22px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  cursor: pointer;
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
