import styled, { css } from 'styled-components';
import { hexToP3 } from '../utils/p3';

/**
 * Theme variables for the modal
 */
const theme = {
  brand: {
    '--family-brand': '#1A88F8',
    '--brand-walletconnect': '#5597F6',
    '--brand-coinbase': '#0C59FE',
    '--brand-metamask-01': '#F6851B',
    '--brand-metamask-02': '#E2761B',
    '--brand-metamask-03': '#CD6116',
    '--brand-metamask-04': '#161616',
    '--brand-metamask-05': '#763D16',
    '--brand-metamask-06': '#D7C1B3',
    '--brand-metamask-07': '#C0AD9E',
    '--brand-metamask-08': '#E4761B',
    '--brand-metamask-09': '#233447',
    '--brand-metamask-10': '#E4751F',
    '--brand-metamask-11': '#FEF5E7',
    '--brand-metamask-12': '#E3C8AB',
    '--brand-trust-01': '#3375BB',
    '--brand-trust-02': '#ffffff',
    '--brand-argent': '#FF875B',
    '--brand-imtoken-01': '#11C4D1',
    '--brand-imtoken-02': '#0062AD',
  },
  light: {
    '--focus-color': '#1A88F8',
    '--overlay-background': 'rgba(0, 0, 0, 0.4)',
    '--body-color': '#373737',
    '--body-color-muted': '#999999',
    '--body-color-muted-hover': '#111111',
    '--body-background': '#ffffff',
    '--body-background-transparent': 'rgba(255,255,255,0)',
    '--body-background-secondary': '#f6f7f9',
    '--body-background-secondary-hover': '#e0e4eb',
    '--body-background-secondary-hover-outline': '#4282FF',
    '--body-divider': '#f7f6f8',
    '--body-color-danger': '#FC6464',
    '--body-color-valid': '#32D74B',

    '--tooltip-body': '#ffffff',
    '--tooltip-color': '#999999',

    '--spinner-color': '#1A88F8',

    '--graphic-wave-stop-01': '#E8F17D',
    '--graphic-wave-stop-02': '#A8ECDE',
    '--graphic-wave-stop-03': '#7AA1F2',
    '--graphic-wave-stop-04': '#DEA1E8',
    '--graphic-wave-stop-05': '#F46D98',

    '--graphic-scaniconwithlogos-01': '#4E4E4E',
    '--graphic-scaniconwithlogos-02': '#272727',
    '--graphic-scaniconwithlogos-03': '#F8D74A',
  },
  dark: {
    '--focus-color': '#1A88F8',
    '--overlay-background': 'rgba(0, 0, 0, 0.9)',
    '--body-color': '#ffffff',
    '--body-color-muted': 'rgba(255, 255, 255, 0.4)',
    '--body-color-muted-hover': 'rgba(255, 255, 255, 0.8)',
    '--body-background': '#2B2B2B',
    '--body-background-transparent': 'rgba(0,0,0,0)',
    '--body-background-secondary': '#333333',
    '--body-background-secondary-hover': '#4D4D4D',
    '--body-background-secondary-hover-outline': '#ffffff',
    '--body-divider': '#383838',
    '--body-color-danger': '#FC6464',

    '--tooltip-body': '#424242',
    '--tooltip-color': '#B3B3B3',

    '--spinner-color': '#ffffff',

    '--graphic-scaniconwithlogos-01': '#AFAFAF',
    '--graphic-scaniconwithlogos-02': '#696969',
    '--graphic-scaniconwithlogos-03': '#F8D74A',

    // Brand dark themes can also go here
    '--brand-trust-01': '#ffffff',
    '--brand-trust-02': '#3375BB',
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

  all: initial;
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

  &,
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
      'Apple Color Emoji', Arial, sans-serif, 'Segoe UI Emoji',
      'Segoe UI Symbol';
    box-sizing: border-box;
    outline: none;
    border: none;
    @media (prefers-reduced-motion) {
      //animation-name: none !important;
    }
  }
  img,
  svg {
    max-width: 100%;
  }
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--focus-color) !important;
  }
`;
