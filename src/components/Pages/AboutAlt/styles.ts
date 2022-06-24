import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import defaultTheme from '../../../constants/defaultTheme';

export const ImageContainer = styled.div`
  height: 208px;
  padding: 0 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
  }
`;

export const Slider = styled.div`
  --background: var(--body-background-secondary);
  --background-transparent: var(--body-background-transparent);
  position: relative;
  overflow: hidden;
  padding: 0 0 4px;
  border-radius: 16px;
`;
export const Slides = styled.div`
  position: relative;
`;

export const Slide = styled(motion.div)`
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0 8px 2px;
`;

export const Dots = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 0 8px;
`;
export const Dot = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  height: 28px;
  padding: 2px;
  &:before {
    content: '';
    display: block;
    width: 16px;
    height: 2px;
    opacity: 0.12;
    border-radius: 2px;
    background: var(--body-color);
    transition: all 200ms ease;
  }
  ${(props) =>
    props.$active
      ? css`
          &:before {
            opacity: 1;
          }
        `
      : css`
          cursor: pointer;
          &:hover:before {
            transform: scaleY(4);
          }
          &:active:before {
          }
        `}
`;
