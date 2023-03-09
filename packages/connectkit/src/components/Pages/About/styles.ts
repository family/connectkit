import { motion } from 'framer-motion';
import styled from './../../../styles/styled';
import { css } from 'styled-components';
import defaultTheme from '../../../constants/defaultTheme';

const imageHeight = 208;

export const ImageContainer = styled.div`
  pointer-events: none;
  user-select: none;
  height: ${imageHeight}px;
  padding: 0 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    display: none;
  }
`;
export const ImageContainerInner = styled(motion.div)``;

export const MobileImageContainer = styled.div`
  pointer-events: none;
  user-select: none;
  height: ${imageHeight}px;
  padding: 0 0 12px;
  display: none;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    display: flex;
  }
`;

export const Slides = styled.div`
  position: relative;
`;

export const Slide = styled(motion.div)<{ $active?: boolean }>`
  scroll-snap-type: x mandatory;
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0 4px 8px;
  /* will-change: transform, opacity; */
  transition: 400ms 50ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-property: transform, opacity;
  ${(props) =>
    !props.$active &&
    css`
      pointer-events: none;
      position: absolute;
      opacity: 0;
      transform: scale(0.95);
      transition-duration: 300ms;
      transition-delay: 0ms;
    `}
`;
export const Slider = styled.div`
  --background: var(--ck-body-background-secondary);
  --background-transparent: var(--ck-body-background-transparent, transparent);
  position: relative;
  padding: 0 0 4px;
  border-radius: 16px;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    margin: 0 -24px;
    ${Slides} {
      position: relative;
      z-index: 3;
      display: flex;
      overflow: auto;
      scroll-behavior: smooth;
      scroll-snap-type: x mandatory;
      margin-top: -${imageHeight}px;
      padding-top: ${imageHeight}px;
      -ms-overflow-style: none; /* Internet Explorer 10+ */
      scrollbar-width: none; /* Firefox */
      &::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
      }
    }
    ${Slide} {
      position: relative;
      opacity: 1;
      transform: none;
      flex-shrink: 0;
      scroll-snap-align: start;
    }
  }
`;

export const Dots = styled.div`
  position: relative;
  top: -1px;
  display: flex;
  justify-content: center;
  pointer-events: auto;
`;
export const Dot = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  height: 28px;
  padding: 2px;
  background: none;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    padding: 4px;
    &:before {
      transform: none !important;
    }
  }
  &:before {
    content: '';
    display: block;
    width: 16px;
    height: 3px;
    opacity: 0.12;
    border-radius: 4px;
    background: var(--ck-accent-color, var(--ck-body-color));
    transition: transform 200ms ease, opacity 180ms ease;
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
            transform: scaleY(3.5);
          }
          &:active:before {
          }
        `}
`;
