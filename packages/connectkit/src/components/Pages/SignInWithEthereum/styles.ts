import { motion } from 'framer-motion';
import styled from './../../../styles/styled';
import { css, keyframes } from 'styled-components';
import defaultTheme from '../../../constants/defaultTheme';

const spinKeyframes = keyframes`
  from{ transform: rotate(0deg); }
  to{   transform: rotate(360deg); }
`;
const lineKeyframes = keyframes`
  from{ background-position: 0 0; }
  to{ background-position: 100% 0; }
`;

export const ContentContainer = styled.div`
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    margin: 5px auto 24px;
    padding: 16px 16px;
    border-radius: var(--ck-tertiary-border-radius, 24px);
    box-shadow: var(--ck-tertiary-box-shadow, none);
    background: var(--ck-body-background-tertiary);
  }
`;

export const LogoContainer = styled(motion.div)`
  z-index: 2;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 100%;
  transition: inherit;
  background: var(--ck-body-background-secondary);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  svg,
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    width: 64px;
    height: 64px;
  }
`;

export const StatusIcon = styled(motion.div)`
  z-index: 2;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  color: currentColor;
  border-radius: 100%;
  transition: inherit;
  svg {
    z-index: 3;
    position: relative;
    transform: scale(0.89);
    transition: inherit;
    opacity: 0.5;
  }
  &:before {
    z-index: 1;
    content: '';
    position: absolute;
    inset: 10px;
    border-radius: inherit;
    border: 1px dashed var(--border-color);
    background: var(--ck-body-background);
    transition: inherit;
    animation: ${spinKeyframes} 10s linear infinite;
  }
  &:after {
    z-index: 2;
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: #34c759;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
    transform: scale(0);
    transition: inherit;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    width: 64px;
    height: 64px;
    svg {
      transform: scale(1.1);
    }
  }
`;

export const StatusGraphicBgSvg = styled(motion.svg)`
  display: block;
  position: relative;
  margin: 0 auto;
  transition: inherit;
  overflow: visible;
  rect {
    stroke: var(--border-color);
    rx: var(--ck-border-radius);
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    display: none;
  }
`;

export const StatusGraphic = styled(motion.div)<{ $connected?: boolean }>`
  --border-color: var(--ck-siwe-border, var(--ck-body-divider));
  --border-size: 0;
  --border-style: dashed;

  user-select: none;
  pointer-events: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
  margin: 12px auto;
  padding: 42px 32px;
  transition: all 320ms cubic-bezier(0.175, 0.885, 0.32, 1.1);
  border: var(--border-size) var(--border-style) var(--border-color);
  border-radius: var(--ck-border-radius);

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    --border-size: 1px;
    margin: 0 auto 20px;
    padding: 38px 0;
    gap: 18px;
    + div {
      // easier than wrapping in another styled component
      padding-bottom: 10px;
    }
  }

  > div {
    z-index: 2;
    position: relative;
    transition: inherit;
  }

  &:before,
  &:after {
    z-index: 1;
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120px;
    height: 1px;
    margin-left: -60px;
    transition: inherit;
    animation: ${lineKeyframes} 10s linear infinite;
    background: linear-gradient(
      90deg,
      var(--border-color),
      var(--border-color) 50%,
      transparent 50%,
      transparent 100%
    );
    background-size: 6px 1px;
  }

  &:after {
    background: var(--border-color);
    transform: scaleX(0);
  }

  ${({ $connected }) =>
    $connected &&
    css`
      &:before {
        opacity: 0;
      }
      &:after {
        transform: none;
      }
      ${StatusGraphicBgSvg} {
        rect {
          stroke-dasharray: 0 0;
        }
      }
      ${LogoContainer} {
        transform: scale(0.62);
      }
      ${StatusIcon} {
        svg {
          transform: scale(1.5);
          opacity: 1;
          color: #fff;
        }
        &:before {
          transform: scale(0);
        }
        &:after {
          transform: scale(1);
        }
      }
      @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
        --border-size: 1px;
        --border-style: solid;
        ${StatusIcon} {
          svg {
            transform: scale(1.75);
          }
        }
      }
    `};
`;
