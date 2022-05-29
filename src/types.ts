export type Theme = 'light' | 'dark' | 'auto';
export type CustomTheme = {
  extends?: Theme;
  '--font-family'?: string;
};
export type Languages = 'en' | 'fr';
