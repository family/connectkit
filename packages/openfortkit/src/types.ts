import { Languages as Lang } from './localizations';
export type Languages = Lang;

export type Theme =
  | 'auto'
  | 'web95'
  | 'retro'
  | 'soft'
  | 'midnight'
  | 'minimal'
  | 'rounded'
  | 'nouns';
export type Mode = 'light' | 'dark' | 'auto';
export type CustomTheme = any; // OLD_TODO: define type

export type All = {
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
  lang?: Languages;
};

export type { ConnectKitOptions } from './components/OpenfortKit/types';
export type { CustomAvatarProps } from './components/Common/Avatar';
