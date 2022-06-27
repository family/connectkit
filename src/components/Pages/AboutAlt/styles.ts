import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';

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
export const ImageContainerInner = styled(motion.div)``;

export const Slider = styled.div`
  --background: var(--body-background-secondary);
  --background-transparent: var(--body-background-transparent);
  position: relative;
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
  padding: 0 8px 8px;
`;

export const Dots = styled.div`
  display: flex;
  justify-content: center;
`;
export const Dot = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  height: 28px;
  padding: 4px;
  background: none;
  &:before {
    content: '';
    display: block;
    width: 7px;
    height: 7px;
    opacity: 0.12;
    border-radius: 7px;
    background: var(--body-color);
    transition: all 200ms ease;
  }
  ${(props) =>
    props.$active
      ? css`
          cursor: default;
          &:before {
            opacity: 1;
          }
        `
      : !props.disabled &&
        css`
          cursor: pointer;
          &:hover:before {
            transform: scale(1.8);
          }
          &:active:before {
          }
        `}
`;
