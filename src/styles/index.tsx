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
