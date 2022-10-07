export type Theme =
  | 'auto'
  | 'web95'
  | 'retro'
  | 'soft'
  | 'midnight'
  | 'minimal'
  | 'rounded';
export type Mode = 'light' | 'dark' | 'auto';
export type Languages = 'en';
export type CustomTheme = {
  // Connect Wallet Button variables
  /** Connect button font size */
  '--ck-connectbutton-font-size'?: string;
  /** Connect button border radius */
  '--ck-connectbutton-border-radius'?: string;
  /** Connect button color */
  '--ck-connectbutton-color'?: string;
  /** Connect button background */
  '--ck-connectbutton-background'?: string;
  /** Connect button box shadow */
  '--ck-connectbutton-box-shadow'?: string;
  /** Connect button color on hover */
  '--ck-connectbutton-hover-color'?: string;
  /** Connect button background on hover */
  '--ck-connectbutton-hover-background'?: string;
  /** Connect button box shadow on hover */
  '--ck-connectbutton-hover-box-shadow'?: string;
  /** Connect button color on press */
  '--ck-connectbutton-active-color'?: string;
  /** Connect button background on press */
  '--ck-connectbutton-active-background'?: string;
  /** Connect button box shadow on press */
  '--ck-connectbutton-active-box-shadow'?: string;

  // Primary Button variables
  /** Primary button text color */
  '--ck-primary-button-color'?: string;
  /** Primary button background */
  '--ck-primary-button-background'?: string;
  /** Primary button box shadow, use inset for border styling (e.g inset 0 0 0 1px #000) */
  '--ck-primary-button-box-shadow'?: string;
  /** Primary button border radius */
  '--ck-primary-button-border-radius'?: string;
  /** Primary button font weight */
  '--ck-primary-button-font-weight'?: string;
  /** Primary button text color on hover */
  '--ck-primary-button-hover-color'?: string;
  /** Primary button background on hover */
  '--ck-primary-button-hover-background'?: string;
  /** Primary button box shadow on hover */
  '--ck-primary-button-hover-box-shadow'?: string;
  /** Primary button border radius on hover */
  '--ck-primary-button-hover-border-radius'?: string;
  /** Primary button text color on press */
  '--ck-primary-button-active-color'?: string;
  /** Primary button background on press */
  '--ck-primary-button-active-background'?: string;
  /** Primary button box shadow on press */
  '--ck-primary-button-active-box-shadow'?: string;
  /** Primary button border radius on press */
  '--ck-primary-button-active-border-radius'?: string;

  // Secondary Button variables
  /** Secondary button color */
  '--ck-secondary-button-color'?: string;
  /** Secondary button background */
  '--ck-secondary-button-background'?: string;
  /** Secondary button box shadow, use inset for border styling (e.g inset 0 0 0 1px #000) */
  '--ck-secondary-button-box-shadow'?: string;
  /** Secondary button border radius */
  '--ck-secondary-button-border-radius'?: string;
  /** Secondary button font weight */
  '--ck-secondary-button-font-weight'?: string;
  /** Secondary button color on hover */
  '--ck-secondary-button-hover-color'?: string;
  /** Secondary button background on hover */
  '--ck-secondary-button-hover-background'?: string;
  /** Secondary button box shadow on hover */
  '--ck-secondary-button-hover-box-shadow'?: string;
  /** Secondary button border radius on hover */
  '--ck-secondary-button-hover-border-radius'?: string;
  /** Secondary button border radius on press */
  '--ck-secondary-button-active-background'?: string;
  /** Secondary button box shadow on press */
  '--ck-secondary-button-active-box-shadow'?: string;

  // Teritary Button variables
  /** Tertiary button color */
  '--ck-tertiary-button-color'?: string;
  /** Tertiary button background */
  '--ck-tertiary-button-background'?: string;
  /** Tertiary button box shadow, use inset for border styling (e.g inset 0 0 0 1px #000) */
  '--ck-tertiary-button-box-shadow'?: string;
  /** Tertiary button border radius */
  '--ck-tertiary-button-border-radius'?: string;
  /** Tertiary button font weight */
  '--ck-tertiary-button-font-weight'?: string;
  /** Tertiary button color on hover */
  '--ck-tertiary-button-hover-color'?: string;
  /** Tertiary button background on hover */
  '--ck-tertiary-button-hover-background'?: string;
  /** Tertiary button box shadow on hover */
  '--ck-tertiary-button-hover-box-shadow'?: string;
  /** Tertiary button border radius on hover */
  '--ck-tertiary-button-hover-border-radius'?: string;

  // Modal variables
  /** Modal overlay color */
  '--ck-overlay-background'?: string;
  /** Modal box shadow */
  '--ck-modal-box-shadow'?: string;
  /** Modal border radius */
  '--ck-border-radius'?: string;
  /** Modal background color */
  '--ck-body-background'?: string;
  /** Modal background color when transparent (required for Safari) */
  '--ck-body-background-transparent'?: string;
  /** Modal secondary background color */
  '--ck-body-background-secondary'?: string;
  /** Modal secondary background color on hover */
  '--ck-body-background-secondary-hover-background'?: string;
  /** Modal secondary background outline on hover */
  '--ck-body-background-secondary-hover-outline'?: string;
  /** Modal tertiary background color */
  '--ck-body-background-tertiary'?: string;

  // Text variables
  /** Text font */
  '--ck-font-family'?: string;
  /** Modal heading/title font weight */
  '--ck-modal-heading-font-weight'?: string;
  /** Text color */
  '--ck-body-color'?: string;
  /** Secondary text color */
  '--ck-body-color-muted'?: string;
  /** Secondary text color on hover */
  '--ck-body-color-muted-hover'?: string;
  /** Color used when failing to connect to a wallet */
  '--ck-body-color-danger'?: string;
  /** Color used when successfully connecting to a wallet */
  '--ck-body-color-valid'?: string;

  // Miscellaneous variables
  /** Focus state color */
  '--ck-focus-color'?: string;
  /** Info/close modal icon colors */
  '--ck-body-action-color'?: string;
  /** Dividing line color */
  '--ck-body-divider'?: string;
  /** QR code dot color */
  '--ck-qr-dot-color'?: string;
  /** QR border color */
  '--ck-qr-border-color'?: string;
  /** QR border radius */
  '--ck-qr-border-radius'?: string;
  /** Tooltip text color */
  '--ck-tooltip-color'?: string;
  /** Tooltip background color */
  '--ck-tooltip-background'?: string;
  /** Tooltip secondary background color */
  '--ck-tooltip-background-secondary'?: string;
  /** Tooltip box shadow */
  '--ck-tooltip-shadow'?: string;
  /** Loading spinner color */
  '--ck-spinner-color'?: string;
};

export type All = {
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
  lang?: Languages;
};
