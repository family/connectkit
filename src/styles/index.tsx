import styled, { css } from 'styled-components';
import { hexToP3 } from '../utils/p3';

/**
 * Theme variables for the modal
 */
const theme = {
  light: {
    '--overlay-background': 'rgba(0, 0, 0, 0.4)',
    '--body-color': '#2b2f43',
    '--body-color-muted': '#666666',
    '--body-color-muted-hover': '#111111',
    '--body-background': '#ffffff',
    '--body-background-secondary': '#f6f7f9',
    '--body-background-secondary-hover': '#e0e4eb',
    '--body-divider': '#f7f6f8',
  },
  dark: {
    '--overlay-background': 'rgba(0, 0, 0, 0.9)',
    '--body-color': '#ffffff',
    '--body-color-muted': 'rgba(255, 255, 255, 0.4)',
    '--body-color-muted-hover': 'rgba(255, 255, 255, 0.8)',
    '--body-background': '#2B2B2B',
    '--body-background-secondary': '#333333',
    '--body-background-secondary-hover': '#4D4D4D',
    '--body-divider': '#383838',
  },
  brand: {
    '--family-brand': '#1A88F8',
    '--brand-walletconnect': '#5597F6',
    '--brand-coinbase': '#0C59FE',
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

/*
 *  Reset stylings to avoid conflicting with the parent websites styling
 * Automatically apply theme based on system theme
 */
// TODO: Think more about how to reset our components as to not be affected by external stylings
export const ResetContainer = styled.div<{ theme: string }>`
  ${createCssVariables(theme.brand)}

  ${(props) => {
    switch (props.theme) {
      case 'light':
        return createCssVariables(theme.light);
      case 'dark':
        return createCssVariables(theme.dark);
      default:
        return css`
          ${createCssVariables(theme.light)}
          @media (prefers-color-scheme: dark) {
            ${createCssVariables(theme.dark)}
          }
        `;
    }
  }}
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
    box-sizing: border-box;
    outline: none;
    border: none;
  }
`;
