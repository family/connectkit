export type Theme = 'light' | 'dark' | 'auto';
export type CustomTheme = {
  extends?: Theme;
  '--font-family'?: string;
  '--focus-color'?: string;
  '--border-radius'?: string;
};
export type Languages = 'en' | 'fr';
