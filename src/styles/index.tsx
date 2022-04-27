import styled, { css } from 'styled-components';
import { hexToP3 } from '../utils/p3';

/**
 * Theme variables for the modal
 */
const theme = {
  light: {
    '--family-brand': '#1A88F8',
    '--body-color': '#2b2f43',
    '--body-background': '#ffffff',
  },
  dark: {
    '--family-brand': '#1A88F8',
    '--body-color': '#ffffff',
    '--body-background': '#2B2B2B',
  },
};

/**
 *  Automatically use p3 if available
 */
//  TODO: Don't use :any type
const createCssVariables = (scheme: any) => {
  return css`
    ${Object.keys(scheme).map((key) => {
      return `${key}:${scheme[key]};`;
    })}
    @supports (color: color(display-p3 1 1 1)) {
      ${Object.keys(scheme).map((key) => {
        return `${key}:${hexToP3(scheme[key])};`;
      })}
    }
  `;
};

/**
 *  Automatically apply theme based on system theme
 */
// TODO: Enable when ready
export const cssVars = css`
  ${createCssVariables(theme.light)}
  @media (prefers-color-scheme: dark) {
    /*
    ${createCssVariables(theme.dark)}
    */
  }
`;

/*
 *  Reset stylings to avoid conflicting with the parent websites styling
 */
// TODO: Think more about how to reset our components as to not be affected by external stylings
export const ResetContainer = styled.div`
  ${cssVars}
  display: inline-block;
  text-align: left;
  text-direction: ltr;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-text-stroke: 0.001px transparent;
  text-size-adjust: none;
  font-size: 16px;
  img,
  svg {
    display: inline-block;
    max-width: 100%;
  }
  &,
  * {
    font-family: 'LFE';
    font-weight: 500;
    box-sizing: border-box;
    outline: none;
    border: none;
  }
`;
