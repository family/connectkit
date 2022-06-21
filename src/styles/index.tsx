import styled, { css } from 'styled-components';
import { CustomTheme } from '../types';
import { isMobile } from '../utils';
import { hexToP3 } from '../utils/p3';

/**
 * Theme variables for the modal
 */
const themeGlobals = {
  default: {
    '--font-family': `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
    'Apple Color Emoji', Arial, sans-serif, 'Segoe UI Emoji',
    'Segoe UI Symbol'`,
    '--border-radius': '20px',
    '--ck-secondary-button-border-radius': '16px',
  },
};
const themeColors = {
  brand: {
    '--family-brand': '#1A88F8',
    '--brand-walletConnect': '#3B99FC',
    '--brand-coinbaseWallet': '#0052FF',
    '--brand-metamask': '#f6851b',
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
    '--brand-trust-01b': '#ffffff', // dark Theme
    '--brand-trust-02b': '#3375BB', // dark Theme
    '--brand-argent': '#f36a3d',
    '--brand-imtoken-01': '#11C4D1',
    '--brand-imtoken-02': '#0062AD',
  },
  light: {
    '--connectbutton-color': '#373737',
    '--connectbutton-background': '#ffffff',
    '--connectbutton-background-hover': '#f6f7f9',
    '--connectbutton-background-active': '#eaecf1',

    '--ck-primary-button-color': '#373737',
    '--ck-primary-button-background': '#ffffff',
    '--ck-primary-button-box-shadow': 'inset 0 0 0 1px #F0F0F0',
    '--ck-primary-button-border-radius': '16px',

    '--ck-primary-button-hover-color': '#373737',
    '--ck-primary-button-hover-background': '#ffffff',
    '--ck-primary-button-hover-box-shadow':
      'inset 0 0 0 2px var(--focus-color)',
    '--ck-primary-button-hover-border-radius': '16px',
    '--ck-primary-button-active-border-radius': '16px',

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
    '--body-background-tertiary': '#F3F4F7',
    '--body-action-color': '#999999',
    '--body-divider': '#f7f6f8',
    '--body-color-danger': '#FF4E4E',
    '--body-color-valid': '#32D74B',

    '--body-button-border-radius': '18px',

    '--mobile-body-background': '#F8F8F8',
    '--mobile-body-color': '#2B2F43',

    '--copytoclipboard-stroke': '#CCCCCC',

    '--tooltip-background': '#ffffff',
    '--tooltip-background-secondary': '#ffffff',
    '--tooltip-color': '#999999',
    '--tooltip-shadow': '0px 2px 10px rgba(0, 0, 0, 0.08)',

    '--spinner-color': 'var(--focus-color)',

    '--graphic-wave-stop-01': '#E8F17D',
    '--graphic-wave-stop-02': '#A8ECDE',
    '--graphic-wave-stop-03': '#7AA1F2',
    '--graphic-wave-stop-04': '#DEA1E8',
    '--graphic-wave-stop-05': '#F46D98',

    '--graphic-scaniconwithlogos-01': '#4E4E4E',
    '--graphic-scaniconwithlogos-02': '#272727',
    '--graphic-scaniconwithlogos-03': '#F8D74A',
    '--graphic-scaniconwithlogos-04': '#F6F7F9',

    '--ens-01-start': '#FF3B30',
    '--ens-01-stop': '#FF9500',
    '--ens-02-start': '#FF9500',
    '--ens-02-stop': '#FFCC00',
    '--ens-03-start': '#FFCC00',
    '--ens-03-stop': '#34C759',
    '--ens-04-start': '#5856D6',
    '--ens-04-stop': '#AF52DE',
    '--ens-05-start': '#5AC8FA',
    '--ens-05-stop': '#007AFF',
    '--ens-06-start': '#007AFF',
    '--ens-06-stop': '#5856D6',
    '--ens-07-start': '#5856D6',
    '--ens-07-stop': '#AF52DE',
    '--ens-08-start': '#AF52DE',
    '--ens-08-stop': '#FF2D55',

    '--qr-dot-color': '#000000',
    '--qr-border-color': '#f7f6f8',
  },

  dark: {
    '--connectbutton-color': '#ffffff',
    '--connectbutton-background': '#2B2B2B',
    '--connectbutton-background-hover': '#333333',
    '--connectbutton-background-active': '#4D4D4D',

    '--ck-primary-button-color': '#ffffff',
    '--ck-primary-button-background': 'transparent',
    '--ck-primary-button-box-shadow': 'inset 0 0 0 1px #3D3D3D',
    '--ck-primary-button-border-radius': '16px',

    '--ck-primary-button-hover-color': '#ffffff',
    '--ck-primary-button-hover-background': 'transparent',
    '--ck-primary-button-hover-box-shadow': 'inset 0 0 0 2px #ffffff',
    '--ck-primary-button-hover-border-radius': '16px',
    '--ck-primary-button-active-border-radius': '16px',

    '--ck-secondary-button-background': '#333333',

    '--focus-color': '#1A88F8',

    '--overlay-background': 'rgba(0, 0, 0, 0.4)',
    '--body-color': '#ffffff',
    '--body-color-muted': 'rgba(255, 255, 255, 0.4)',
    '--body-color-muted-hover': 'rgba(255, 255, 255, 0.8)',
    '--body-background': '#2B2B2B',
    '--body-background-transparent': 'rgba(0,0,0,0)',
    '--body-background-secondary': '#333333',
    '--body-background-secondary-hover': '#4D4D4D',
    '--body-background-secondary-hover-outline': '#ffffff',
    '--body-background-tertiary': '#333333',
    '--body-action-color': '#808080',
    '--body-divider': '#383838',
    '--body-color-danger': '#FF4E4E',

    '--body-button-border-radius': '18px',

    '--copytoclipboard-stroke': '#555555',

    '--tooltip-background': '#2B2B2B',
    '--tooltip-background-secondary': '#333333',
    '--tooltip-color': '#999999',
    '--tooltip-shadow': '0px 2px 10px rgba(0, 0, 0, 0.08)',

    '--spinner-color': 'var(--focus-color)',

    '--graphic-wave-stop-01': '#E8F17D',
    '--graphic-wave-stop-02': '#A8ECDE',
    '--graphic-wave-stop-03': '#7AA1F2',
    '--graphic-wave-stop-04': '#DEA1E8',
    '--graphic-wave-stop-05': '#F46D98',

    '--graphic-scaniconwithlogos-01': '#AFAFAF',
    '--graphic-scaniconwithlogos-02': '#696969',
    '--graphic-scaniconwithlogos-03': '#F8D74A',
    '--graphic-scaniconwithlogos-04': '#3D3D3D',

    '--ens-01-start': '#FF453A',
    '--ens-01-stop': '#FF9F0A',
    '--ens-02-start': '#FF9F0A',
    '--ens-02-stop': '#FFD60A',
    '--ens-03-start': '#FFD60A',
    '--ens-03-stop': '#32D74B',
    '--ens-04-start': '#32D74B',
    '--ens-04-stop': '#64D2FF',
    '--ens-05-start': '#64D2FF',
    '--ens-05-stop': '#0A84FF',
    '--ens-06-start': '#0A84FF',
    '--ens-06-stop': '#5E5CE6',
    '--ens-07-start': '#5E5CE6',
    '--ens-07-stop': '#BF5AF2',
    '--ens-08-start': '#BF5AF2',
    '--ens-08-stop': '#FF2D55',

    '--qr-dot-color': '#ffffff',
    '--qr-border-color': '#3d3d3d',
  },
  testTheme: {
    '--font-family': 'Tahoma',
    '--border-radius': 17,
    '--connectbutton-color': '#373737',
    '--connectbutton-background': '#ffffff',
    '--connectbutton-background-hover': '#f6f7f9',
    '--connectbutton-background-active': '#eaecf1',

    '--focus-color': '#1A88F8',
    '--overlay-background': '#008282',
    '--body-color': '#373737',
    '--body-color-muted': '#373737',
    '--body-color-muted-hover': '#111111',
    '--body-background': '#F0EDE2',
    '--body-background-transparent': 'rgba(255,255,255,0)',
    '--body-background-secondary-hover': '#FAFAFA',
    '--body-background-secondary-hover-outline': '#4282FF',
    '--body-action-color': '#373737',
    '--body-color-danger': '#FC6464',
    '--body-color-valid': '#32D74B',

    '--body-divider': '#919B9C',
    '--body-divider-box-shadow': '0px 1px 0px #FBFBF8',

    // Primary button
    '--ck-primary-button-background':
      'linear-gradient(180deg, #FFFFFF 0%, #F0F0EA 100%), #F5F5F1',
    '--ck-primary-button-box-shadow':
      '1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset -1px -2px 2px rgba(0, 0, 0, 0.2)',
    '--ck-primary-button-border': '1px solid #003C74',
    '--ck-primary-button-border-radius': '4.5px',

    // Primary button hover
    '--ck-primary-button-hover-box-shadow':
      '1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 5px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)',

    // Modal
    '--ck-modal-heading-font-weight': 400,
    '--ck-modal-box-shadow':
      'inset 0px -3px 0px #0F37A9, inset -2px 0px 0px #0F37A9, inset 0px -4px 0px #0D5DDF, inset -4px 0px 0px #0D5DDF, inset 2px 0px 0px #0453DD, inset 0px 2px 0px #044FD1, inset 4px 0px 0px #4283EB, inset 0px 4px 0px #4283EB',
    '--ck-modal-h1-font-weight': 400,

    // Secondary button
    '--ck-secondary-button-border-radius': '4.5px',
    '--ck-secondary-button-box-shadow':
      '1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset -1px -2px 2px rgba(0, 0, 0, 0.2)',
    '--ck-secondary-button-border': '1px solid #003C74',
    '--ck-secondary-button-background':
      'linear-gradient(180deg, #FFFFFF 0%, #F0F0EA 100%), #F5F5F1',

    // Secondary button hover
    '--ck-secondary-button-hover-box-shadow':
      '1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 4px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)',

    '--body-background-secondary': 'rgba(0, 0, 0, 0.1)',
    '--body-background-tertiary': 'rgba(0, 0, 0, 0.1)',
    '--body-button-border-radius': '100px',
    '--body-button-text-align': 'left',
    '--body-connector-label-padding': '0 0',
    '--body-connector-icon-left': 'auto',
    '--body-connector-icon-right': '20px',
    '--body-button-border': '1px solid #e6e6e6',
    '--body-connector-button-border': '1px solid #e6e6e6',
    '--body-button-box-shadow': '0 2px 4px rgba(0, 0, 0, 0.05 )',

    '--mobile-body-background': '#F8F8F8',
    '--mobile-body-color': '#2B2F43',

    '--qr-dot-color': '#000000',
    '--qr-border-color': '#919B9C',
    '--qr-border-radius': '0',
    '--copytoclipboard-stroke': '#CCCCCC',

    '--tooltip-background':
      'linear-gradient(270deg, #F7F3E6 7.69%, #F5F7DA 100%)',
    '--tooltip-background-secondary': '#f6f7f9',
    '--tooltip-color': '#000000',
    '--tooltip-shadow':
      ' 0 0 0 1.5px #2b2622, 0px 2px 10px rgba(0, 0, 0, 0.08)',

    '--spinner-color': 'var(--focus-color)',

    '--graphic-wave-stop-01': '#E8F17D',
    '--graphic-wave-stop-02': '#A8ECDE',
    '--graphic-wave-stop-03': '#7AA1F2',
    '--graphic-wave-stop-04': '#DEA1E8',
    '--graphic-wave-stop-05': '#F46D98',

    '--graphic-scaniconwithlogos-01': '#4E4E4E',
    '--graphic-scaniconwithlogos-02': '#272727',
    '--graphic-scaniconwithlogos-03': '#F8D74A',
    '--graphic-scaniconwithlogos-04': '#F6F7F9',

    '--ens-01-start': '#FF3B30',
    '--ens-01-stop': '#FF9500',
    '--ens-02-start': '#FF9500',
    '--ens-02-stop': '#FFCC00',
    '--ens-03-start': '#FFCC00',
    '--ens-03-stop': '#34C759',
    '--ens-04-start': '#5856D6',
    '--ens-04-stop': '#AF52DE',
    '--ens-05-start': '#5AC8FA',
    '--ens-05-stop': '#007AFF',
    '--ens-06-start': '#007AFF',
    '--ens-06-stop': '#5856D6',
    '--ens-07-start': '#5856D6',
    '--ens-07-stop': '#AF52DE',
    '--ens-08-start': '#AF52DE',
    '--ens-08-stop': '#FF2D55',
  },
  testThemeAccent: {
    '--accent-color': '#007AFF',
    '--accent-text-color': '#ffffff',

    '--connectbutton-color': '#373737',
    '--connectbutton-background': '#ffffff',
    '--connectbutton-background-hover': '#f6f7f9',
    '--connectbutton-background-active': '#eaecf1',

    '--focus-color': '#1A88F8',
    '--overlay-background': 'rgba(0, 0, 0, 0.4)',
    '--body-color': '#373737',
    '--body-color-muted': '#999999',
    '--body-color-muted-hover': '#111111',
    '--body-background': '#ffffff',
    '--body-background-transparent': 'rgba(255,255,255,0)',
    '--body-background-secondary': '#ffffff',
    '--body-background-secondary-hover': '#f6f7f9',
    '--body-background-secondary-hover-outline': '#4282FF',
    '--body-action-color': '#999999',
    '--body-divider': '#f7f6f8',
    '--body-color-danger': '#FC6464',
    '--body-color-valid': '#32D74B',

    '--body-button-border-radius': '18px',
    '--body-connector-button-border': '1px solid #e6e6e6',

    '--mobile-body-background': '#F8F8F8',
    '--mobile-body-color': '#2B2F43',

    '--copytoclipboard-stroke': '#CCCCCC',

    '--tooltip-background': '#ffffff',
    '--tooltip-background-secondary': '#f6f7f9',
    '--tooltip-color': '#999999',
    '--tooltip-shadow': '0px 2px 10px rgba(0, 0, 0, 0.08), 0 0 0 1px #2b2622',

    '--spinner-color': 'var(--focus-color)',

    '--graphic-wave-stop-01': '#E8F17D',
    '--graphic-wave-stop-02': '#A8ECDE',
    '--graphic-wave-stop-03': '#7AA1F2',
    '--graphic-wave-stop-04': '#DEA1E8',
    '--graphic-wave-stop-05': '#F46D98',

    '--graphic-scaniconwithlogos-01': '#4E4E4E',
    '--graphic-scaniconwithlogos-02': '#272727',
    '--graphic-scaniconwithlogos-03': '#F8D74A',
    '--graphic-scaniconwithlogos-04': '#F6F7F9',

    '--ens-01-start': '#FF3B30',
    '--ens-01-stop': '#FF9500',
    '--ens-02-start': '#FF9500',
    '--ens-02-stop': '#FFCC00',
    '--ens-03-start': '#FFCC00',
    '--ens-03-stop': '#34C759',
    '--ens-04-start': '#5856D6',
    '--ens-04-stop': '#AF52DE',
    '--ens-05-start': '#5AC8FA',
    '--ens-05-stop': '#007AFF',
    '--ens-06-start': '#007AFF',
    '--ens-06-stop': '#5856D6',
    '--ens-07-start': '#5856D6',
    '--ens-07-stop': '#AF52DE',
    '--ens-08-start': '#AF52DE',
    '--ens-08-stop': '#FF2D55',
  },
  lightMobile: {
    /*
    '--body-background': '#F8F8F8',
    '--body-color': '#2B2F43',
    '--body-background-secondary': '#ffffff',
    '--body-background-secondary-hover': '#ffffff',
    '--body-background-secondary-hover-outline': '#ffffff',
    */
  },
  darkMobile: {
    /*
    '--body-background': '#282828',
    '--body-color': '#ffffff',
    '--body-background-secondary': '#333333',
    '--body-background-secondary-hover': '#333333',
    '--body-background-secondary-hover-outline': '#333333',
    */
  },
};

/**
 *  Automatically use p3 if available
 */
//  TODO: Don't use :any type
const createCssVars = (scheme: any, important?: boolean) => {
  return css`
    ${Object.keys(scheme).map((key) => {
      const value = scheme[key];
      return value && `${key}:${value};`;
    })}
  `;
};
const createCssColors = (scheme: any, override?: boolean) => {
  const important = override ? ' !important' : '';
  return css`
    ${Object.keys(scheme).map((key) => {
      const value = scheme[key];
      return value && `${key}:${value}${important};`;
    })}
    @supports (color: color(display-p3 1 1 1)) {
      ${Object.keys(scheme).map((key) => {
        const value = scheme[key];
        return `${key}:${hexToP3(value)}${important};`;
      })}
    }
  `;
};

/*
 *  Reset stylings to avoid conflicting with the parent websites styling
 * Automatically apply theme based on system theme
 */
// TODO: Think more about how to reset our components as to not be affected by external stylings
// TODO: Merge theme objects instead of overriding
export const ResetContainer = styled.div<{
  theme: string;
  customTheme?: CustomTheme;
}>`
  ${createCssColors(themeColors.brand)}
  ${createCssVars(themeGlobals.default)};

  ${(props) => {
    switch (props.theme) {
      case 'light':
        return createCssColors(themeColors.light);
      case 'dark':
        return createCssColors(themeColors.dark);
      case 'testTheme':
        return createCssColors(themeColors.testTheme);
      case 'testThemeAccent':
        return createCssColors(themeColors.testThemeAccent);
      default:
        return css`
          ${createCssColors(themeColors.light)}
          @media (prefers-color-scheme: dark) {
            ${createCssColors(themeColors.dark)}
          }
        `;
    }
  }}
  ${(props) => {
    const mobile = isMobile();
    if (!mobile) return;
    switch (props.theme) {
      case 'light':
        return createCssColors(themeColors.lightMobile);
      case 'dark':
        return createCssColors(themeColors.darkMobile);
      default:
        return css`
          ${createCssColors(themeColors.lightMobile)}
          @media (prefers-color-scheme: dark) {
            ${createCssColors(themeColors.darkMobile)}
          }
        `;
    }
  }}


  ${(props) => {
    if (props.customTheme) {
      return createCssColors(props.customTheme, true);
    }
  }}

  all: initial;
  text-align: left;
  text-direction: ltr;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-text-stroke: 0.001px transparent;
  text-size-adjust: none;
  font-size: 16px;

  button {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-text-stroke: 0.001px transparent;
  }

  &,
  * {
    font-family: var(--font-family);
    box-sizing: border-box;
    outline: none;
    border: none;
  }
  /*
  @media (prefers-reduced-motion) {
    * {
      animation-duration: 60ms !important;
      transition-duration: 60ms !important;
    }
  }
  */
  img,
  svg {
    max-width: 100%;
  }
  strong {
    font-weight: 600;
  }
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--focus-color) !important;
  }
`;
