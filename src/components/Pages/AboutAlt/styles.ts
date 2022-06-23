import styled, { css } from 'styled-components';
import defaultTheme from '../../../constants/defaultTheme';

export const ImageContainer = styled.div`
  height: 176px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 8px;
  svg {
    display: block;
  }
`;

export const Slider = styled.div`
  --background: var(--body-background-secondary);
  --background-transparent: var(--body-background-transparent);
  position: relative;
  overflow: hidden;
  margin: -12px 0 3px;
  background: var(--background);
  border-radius: 16px;
  &:before,
  &:after {
    z-index: 2;
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 16px;
  }

  &:before {
    left: 0;
    background: linear-gradient(
      90deg,
      var(--background),
      var(--background-transparent)
    );
  }
  &:after {
    right: 0;
    background: linear-gradient(
      270deg,
      var(--background),
      var(--background-transparent)
    );
  }
`;
export const Slides = styled.div`
  display: flex;
  transition: transform 200ms ease;
  width: var(--width);
  transform: translateX(var(--x));
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    transform: none;
    width: 100%;
    overflow: auto;
    scroll-snap-type: x mandatory;
  }
`;

export const Slide = styled.div`
  width: 100%;
  padding: 20px 28px 2px;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    flex-shrink: 0;
    scroll-snap-align: start;
  }
`;

export const Dots = styled.div`
  display: flex;
  justify-content: center;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    display: none;
  }
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
