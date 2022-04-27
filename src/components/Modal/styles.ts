import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled(motion.div)`
  z-index: 2;
  position: relative;

  width: auto;
  max-width: 90vw;

  color: var(--body-color);
  background: var(--body-background);
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 16px;

  &,
  * {
    font-family: 'LFE';
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

export const BackgroundOverlay = styled(motion.div)`
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
`;

export const CloseButton = styled(motion.button)`
  z-index: 3;
  cursor: pointer;
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  cursor: pointer;
  background: #f6f7f9;
  &:hover {
    background: #ebebeb;
  }
`;
