import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { CustomTheme } from '../types';
import { hexToP3 } from '../utils/p3';

import predefinedThemes from './themes';

function LightenDarkenColor(col: string, amt: number) {
  var usePound = false;

  if (col[0] == '#') {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col, 16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
}

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
  graphics: {
    light: {
      '--graphic-wave-stop-01': '#E8F17D',
      '--graphic-wave-stop-02': '#A8ECDE',
      '--graphic-wave-stop-03': '#7AA1F2',
      '--graphic-wave-stop-04': '#DEA1E8',
      '--graphic-wave-stop-05': '#F46D98',

      '--graphic-scaniconwithlogos-01': '#4E4E4E',
      '--graphic-scaniconwithlogos-02': '#272727',
      '--graphic-scaniconwithlogos-03': '#F8D74A',
      '--graphic-scaniconwithlogos-04': '#F6F7F9',
    },
    dark: {
      '--graphic-wave-stop-01': '#E8F17D',
      '--graphic-wave-stop-02': '#A8ECDE',
      '--graphic-wave-stop-03': '#7AA1F2',
      '--graphic-wave-stop-04': '#DEA1E8',
      '--graphic-wave-stop-05': '#F46D98',

      '--graphic-scaniconwithlogos-01': '#AFAFAF',
      '--graphic-scaniconwithlogos-02': '#696969',
      '--graphic-scaniconwithlogos-03': '#F8D74A',
      '--graphic-scaniconwithlogos-04': '#3D3D3D',
    },
  },
  ens: {
    light: {
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
    dark: {
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
    },
  },
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
};
const themeColors = {
  light: predefinedThemes.base.light,
  dark: predefinedThemes.base.dark,
  web95: predefinedThemes.web95,
  retro: predefinedThemes.retro,
  soft: predefinedThemes.soft,
  midnight: predefinedThemes.midnight,
  minimal: predefinedThemes.minimal,
  rounded: predefinedThemes.rounded,
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

const themes = {
  default: createCssVars(themeGlobals.default),
  light: createCssColors(themeColors.light),
  dark: createCssColors(themeColors.dark),
  web95: createCssColors(themeColors.web95),
  retro: createCssColors(themeColors.retro),
  soft: createCssColors(themeColors.soft),
  midnight: createCssColors(themeColors.midnight),
  minimal: createCssColors(themeColors.minimal),
  rounded: createCssColors(themeColors.rounded),
};
const globals = {
  brand: createCssVars(themeGlobals.brand),
  ensLight: createCssVars(themeGlobals.ens.light),
  ensDark: createCssVars(themeGlobals.ens.dark),
  graphicsLight: createCssVars(themeGlobals.graphics.light),
  graphicsDark: createCssVars(themeGlobals.graphics.dark),
};

const globalsLight = css`
  ${globals.brand}
  ${globals.ensLight}
  ${globals.graphicsLight}
`;
const globalsDark = css`
  ${globals.brand}
  ${globals.ensDark}
  ${globals.graphicsDark}
`;

/*
 *  Reset stylings to avoid conflicting with the parent websites styling
 * Automatically apply theme based on system theme
 */
// TODO: Think more about how to reset our components as to not be affected by external stylings
// TODO: Merge theme objects instead of overriding

let mode = 'auto';
export const ResetContainer = styled(motion.div)<{
  $useTheme?: string;
  $useMode?: string;
  $customTheme?: CustomTheme;
}>`
  ${themes.default}

  ${(props) => {
    switch (props.$useTheme) {
      case 'web95':
        mode = 'light';
        return themes.web95;
      case 'retro':
        mode = 'light';
        return themes.retro;
      case 'soft':
        mode = 'light';
        return themes.soft;
      case 'midnight':
        mode = 'dark';
        return themes.midnight;
      case 'minimal':
        mode = 'light';
        return themes.minimal;
      case 'rounded':
        mode = 'light';
        return themes.rounded;
      default:
        if (props.$useMode === 'light') {
          mode = 'light';
          return themes.light;
        } else if (props.$useMode === 'dark') {
          mode = 'dark';
          return themes.dark;
        } else {
          return css`
            @media (prefers-color-scheme: light) {
              ${themes.light}
            }
            @media (prefers-color-scheme: dark) {
              ${themes.dark}
            }
          `;
        }
    }
  }}

  ${(props) => {
    switch (mode) {
      case 'light':
        return globalsLight;
      case 'dark':
        return globalsDark;
      default:
        return css`
          ${globalsLight}
          @media (prefers-color-scheme: dark) {
            ${globalsDark}
          }
        `;
    }
  }}


  ${(props) => {
    //console.log(props.$customTheme);

    if (
      props.$customTheme &&
      props.$customTheme['--ck-accent-color'] &&
      ['light', 'dark', 'auto', '', undefined].includes(props.$useTheme)
    ) {
      const accentColor = props.$customTheme['--ck-accent-color'];
      const accentTextColor =
        props.$customTheme['--ck-accent-text-color'] ?? '#ffffff';
      return {
        '--ck-accent-color': accentColor,
        '--ck-accent-text-color': accentTextColor,
        // '--connectbutton-color': accentTextColor,
        // '--connectbutton-background': accentColor,
        // '--connectbutton-background-hover': accentColor,
        // '--connectbutton-background-active': LightenDarkenColor(
        // accentColor,
        // 20
        // ),
        '--ck-secondary-button-background': accentColor,
        '--ck-secondary-button-hover-background': accentColor,
        '--ck-secondary-button-color': accentTextColor,
        '--button-primary-color': accentTextColor,
        '--focus-color': accentColor,
      };
    }
    if (props.$customTheme) {
      return createCssColors(props.$customTheme, true);
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
