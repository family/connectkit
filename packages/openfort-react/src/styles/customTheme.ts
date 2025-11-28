export type CustomTheme = {
  /** Global font-family used in `src/styles/index.ts` (global styles). */
  '--ck-font-family'?: string
  /** Default border radius used across buttons/containers (e.g. `Input`, `Providers`). */
  '--ck-border-radius'?: string

  /** Connect button font size (used by Connect button components / styles). */
  '--ck-connectbutton-font-size'?: string
  /** Connect button font-weight (where themes set stronger weight). */
  '--ck-connectbutton-font-weight'?: string
  /** Connect button border radius (used by connect button and variants). */
  '--ck-connectbutton-border-radius'?: string
  /** Connect button foreground color (`ConnectButton`). */
  '--ck-connectbutton-color'?: string
  /** Connect button background (various connect button styles). */
  '--ck-connectbutton-background'?: string

  /** Connect button box-shadow used in button visuals (Providers, dropdowns). */
  '--ck-connectbutton-box-shadow'?: string

  /** Hover color for the connect button. */
  '--ck-connectbutton-hover-color'?: string
  /** Hover background for the connect button. */
  '--ck-connectbutton-hover-background'?: string
  /** Hover box-shadow for connect button (applied in hover states). */
  '--ck-connectbutton-hover-box-shadow'?: string

  /** Active color for the connect button. */
  '--ck-connectbutton-active-color'?: string
  /** Active background for the connect button. */
  '--ck-connectbutton-active-background'?: string
  /** Active box-shadow for the connect button. */
  '--ck-connectbutton-active-box-shadow'?: string

  /** Balance area text color inside the connect button (used in Providers/Connect UI). */
  '--ck-connectbutton-balance-color'?: string
  /** Balance area background inside the connect button. */
  '--ck-connectbutton-balance-background'?: string
  /** Balance area box-shadow (themes often compose using other vars). */
  '--ck-connectbutton-balance-box-shadow'?: string
  /** Balance hover background (used in balance hover states). */
  '--ck-connectbutton-balance-hover-background'?: string
  /** Balance hover box-shadow (used in balance hover states). */
  '--ck-connectbutton-balance-hover-box-shadow'?: string
  /** Balance active background (used for pressed state). */
  '--ck-connectbutton-balance-active-background'?: string
  /** Balance active box-shadow. */
  '--ck-connectbutton-balance-active-box-shadow'?: string
  /** Legacy/compound connectbutton balance box-shadow key found in some themes. */
  '--ck-connectbutton-balance-connectbutton-box-shadow'?: string
  /** Legacy/compound connectbutton balance border-radius key from some themes. */
  '--ck-connectbutton-balance-connectbutton-border-radius'?: string

  /** Primary button border radius (used in many primary buttons). */
  '--ck-primary-button-border-radius'?: string
  /** Primary button foreground color. */
  '--ck-primary-button-color'?: string
  /** Primary button background. */
  '--ck-primary-button-background'?: string
  /** Primary button box-shadow (used by various buttons across components). */
  '--ck-primary-button-box-shadow'?: string
  /** Primary button font weight (used e.g. in Providers and CreateWallet headings). */
  '--ck-primary-button-font-weight'?: string

  /** Primary button hover color (where applied). */
  '--ck-primary-button-hover-color'?: string
  /** Primary button hover background. */
  '--ck-primary-button-hover-background'?: string
  /** Primary button hover box-shadow (applies on hover in some themes). */
  '--ck-primary-button-hover-box-shadow'?: string
  /** Primary button hover border-radius override (rare). */
  '--ck-primary-button-hover-border-radius'?: string

  /** Primary button active background (pressed state). */
  '--ck-primary-button-active-background'?: string
  /** Primary button active box-shadow. */
  '--ck-primary-button-active-box-shadow'?: string
  /** Primary button active border-radius (rare). */
  '--ck-primary-button-active-border-radius'?: string

  /** Secondary/background variant used by some themes for connector buttons. */
  '--ck-connectbutton-background-secondary'?: string
  /** Secondary button hover color (used in Button styles). */
  '--ck-secondary-button-hover-color'?: string
  /** Secondary button hover border-radius override. */
  '--ck-secondary-button-hover-border-radius'?: string
  /** Secondary button active box-shadow (used on :active). */
  '--ck-secondary-button-active-box-shadow'?: string
  /** Secondary button border radius (used by `Input`, `Providers`, etc.). */
  '--ck-secondary-button-border-radius'?: string
  /** Secondary button foreground color. */
  '--ck-secondary-button-color'?: string
  /** Secondary button background. */
  '--ck-secondary-button-background'?: string
  /** Secondary button box-shadow (used widely by components). */
  '--ck-secondary-button-box-shadow'?: string
  /** Secondary button font weight (when themes adjust emphasis). */
  '--ck-secondary-button-font-weight'?: string
  /** Secondary button hover background. */
  '--ck-secondary-button-hover-background'?: string
  /** Secondary button hover box-shadow. */
  '--ck-secondary-button-hover-box-shadow'?: string

  /** Tertiary button background (tertiary/ghost button). */
  '--ck-tertiary-button-background'?: string

  /** Input field background (used by `Input` component). */
  '--ck-input-background'?: string
  /** Input hover background (used by `Input` hover states). */
  '--ck-input-hover-background'?: string

  /** Modal box shadow (used by modals). */
  '--ck-modal-box-shadow'?: string
  /** Modal H1 font weight (used in modal headings). */
  '--ck-modal-h1-font-weight'?: string | number
  /** Modal heading font weight (used in modal headings). */
  '--ck-modal-heading-font-weight'?: string | number

  /** Overlay background used for modal/backdrop layers. */
  '--ck-overlay-background'?: string
  /** Optional backdrop filter for overlays (some themes use blur). */
  '--ck-overlay-backdrop-filter'?: string

  /** Primary body text color (used across components & icons). */
  '--ck-body-color'?: string
  /** Muted body color (used in secondary text). */
  '--ck-body-color-muted'?: string
  /** Hover/active version of muted color. */
  '--ck-body-color-muted-hover'?: string
  /** Page background color (global body background). */
  '--ck-body-background'?: string
  /** Transparent variant of body background (used for overlays). */
  '--ck-body-background-transparent'?: string
  /** Secondary body background used by panels (e.g., Providers list). */
  '--ck-body-background-secondary'?: string
  /** Secondary hover background used by some components. */
  '--ck-body-background-secondary-hover-background'?: string
  /** Outline color used for hover states on secondary backgrounds. */
  '--ck-body-background-secondary-hover-outline'?: string
  /** Tertiary body background used by cards/tertiary panels. */
  '--ck-body-background-tertiary'?: string
  /** Accent color for actions (used in Providers, badges). */
  '--ck-body-action-color'?: string
  /** Divider color used across layouts and lists. */
  '--ck-body-divider'?: string
  /** Secondary divider color (where present). */
  '--ck-body-divider-secondary'?: string
  /** Divider box-shadow used in some themes. */
  '--ck-body-divider-box-shadow'?: string
  /** Error color used by error states. */
  '--ck-body-color-danger'?: string
  /** Valid/success color used by success states. */
  '--ck-body-color-valid'?: string
  /** Body button text alignment (rare override used in some themes). */
  '--ck-body-button-text-align'?: string
  /** Body button box-shadow (used by card-like buttons). */
  '--ck-body-button-box-shadow'?: string

  /** Disclaimer background (used in the disclaimer block). */
  '--ck-body-disclaimer-background'?: string
  /** Disclaimer box-shadow (used in themed disclaimers). */
  '--ck-body-disclaimer-box-shadow'?: string
  /** Disclaimer text color. */
  '--ck-body-disclaimer-color'?: string
  /** Disclaimer font size (used in some themes). */
  '--ck-body-disclaimer-font-size'?: string
  /** Disclaimer font weight (used by some themes). */
  '--ck-body-disclaimer-font-weight'?: string
  /** Disclaimer link color. */
  '--ck-body-disclaimer-link-color'?: string
  /** Disclaimer link hover color. */
  '--ck-body-disclaimer-link-hover-color'?: string

  /** Stroke color for the copy-to-clipboard icon. */
  '--ck-copytoclipboard-stroke'?: string

  /** Tooltip border radius (used in tooltip components). */
  '--ck-tooltip-border-radius'?: string
  /** Tooltip background. */
  '--ck-tooltip-background'?: string
  /** Tooltip secondary background. */
  '--ck-tooltip-background-secondary'?: string
  /** Tooltip foreground color. */
  '--ck-tooltip-color'?: string
  /** Tooltip shadow (used in tooltips). */
  '--ck-tooltip-shadow'?: string

  /** Spinner color (often references `--ck-focus-color`). */
  '--ck-spinner-color'?: string

  /** Dropdown button foreground color (used in network dropdowns). */
  '--ck-dropdown-button-color'?: string
  /** Dropdown button box-shadow. */
  '--ck-dropdown-button-box-shadow'?: string
  /** Dropdown button background. */
  '--ck-dropdown-button-background'?: string
  /** Dropdown button hover color. */
  '--ck-dropdown-button-hover-color'?: string
  /** Dropdown button hover background. */
  '--ck-dropdown-button-hover-background'?: string
  /** Dropdown button hover box-shadow. */
  '--ck-dropdown-button-hover-box-shadow'?: string

  /** Dropdown pending color (used in pending/disabled states). */
  '--ck-dropdown-pending-color'?: string
  /** Dropdown active foreground color. */
  '--ck-dropdown-active-color'?: string
  /** Dropdown active static color (alternative). */
  '--ck-dropdown-active-static-color'?: string
  /** Dropdown active background color. */
  '--ck-dropdown-active-background'?: string
  /** Dropdown active box-shadow. */
  '--ck-dropdown-active-box-shadow'?: string
  /** Dropdown active border-radius. */
  '--ck-dropdown-active-border-radius'?: string
  /** Dropdown active inset (used by some themes). */
  '--ck-dropdown-active-inset'?: string
  /** Dropdown foreground color. */
  '--ck-dropdown-color'?: string
  /** Dropdown background color. */
  '--ck-dropdown-background'?: string
  /** Dropdown box-shadow (used across dropdowns). */
  '--ck-dropdown-box-shadow'?: string
  /** Dropdown border-radius. */
  '--ck-dropdown-border-radius'?: string

  /** Alert text color (used in alert banners). */
  '--ck-alert-color'?: string
  /** Alert background. */
  '--ck-alert-background'?: string
  /** Alert box-shadow. */
  '--ck-alert-box-shadow'?: string
  /** Alert border radius. */
  '--ck-alert-border-radius'?: string

  /** QR code border radius. */
  '--ck-qr-border-radius'?: string
  /** QR code dot color. */
  '--ck-qr-dot-color'?: string
  /** QR code border color. */
  '--ck-qr-border-color'?: string
  /** QR code background. */
  '--ck-qr-background'?: string

  /** Focus color used for outlines (used in `styles/index.ts` for :focus). */
  '--ck-focus-color'?: string

  /** SIWE border color used in SIWE screens. */
  '--ck-siwe-border'?: string

  /** Tertiary border radius (cards/tertiary components). */
  '--ck-tertiary-border-radius'?: string
  /** Tertiary box-shadow (used in tertiary card styles). */
  '--ck-tertiary-box-shadow'?: string

  /** Recent badge border radius (used for recent items). */
  '--ck-recent-badge-border-radius'?: string
  /** Recent badge top offset (position tweak used by some themes). */
  '--ck-recent-badge-top-offset'?: string
  /** Recent badge color. */
  '--ck-recent-badge-color'?: string
  /** Recent badge background. */
  '--ck-recent-badge-background'?: string
  /** Recent badge box-shadow. */
  '--ck-recent-badge-box-shadow'?: string

  /** Graphic primary color (used by inlined SVGs and assets like `wave.tsx`). */
  '--ck-graphic-primary-color'?: string
  /** Graphic primary background (used by SVG assets). */
  '--ck-graphic-primary-background'?: string
  /** Graphic primary box-shadow. */
  '--ck-graphic-primary-box-shadow'?: string
  /** Graphic secondary color (used by themed graphics). */
  '--ck-graphic-secondary-color'?: string
  /** Graphic secondary background. */
  '--ck-graphic-secondary-background'?: string
  /** Graphic secondary box-shadow. */
  '--ck-graphic-secondary-box-shadow'?: string
  /** Graphic compass color (used by compass SVG assets). */
  '--ck-graphic-compass-color'?: string
  /** Graphic compass background. */
  '--ck-graphic-compass-background'?: string
  /** Graphic compass box-shadow. */
  '--ck-graphic-compass-box-shadow'?: string
  /** Graphic globe background (if used). */
  '--ck-graphic-globe-background'?: string
  /** Graphic globe lines color. */
  '--ck-graphic-globe-lines'?: string
  /** Graphic globe box-shadow. */
  '--ck-graphic-globe-box-shadow'?: string

  /** Primary page background used as a fallback for primary buttons. */
  '--ck-body-background-primary'?: string

  /** Primary button hover color (used in Button styles). */
  '--ck-button-primary-hover-color'?: string

  /** Tertiary button color (used by tertiary variant). */
  '--ck-tertiary-button-color'?: string
  /** Tertiary button box-shadow. */
  '--ck-tertiary-button-box-shadow'?: string
  /** Tertiary button border radius. */
  '--ck-tertiary-button-border-radius'?: string
  /** Tertiary button font weight. */
  '--ck-tertiary-button-font-weight'?: string
  /** Tertiary button hover background. */
  '--ck-tertiary-button-hover-background'?: string
  /** Tertiary button hover box-shadow. */
  '--ck-tertiary-button-hover-box-shadow'?: string
  /** Tertiary button hover border-radius. */
  '--ck-tertiary-button-hover-border-radius'?: string

  /** Accent color and its text color used by hover states in some components. */
  '--ck-accent-color'?: string
  /** Accent color and its text color used by hover states in some components. */
  '--ck-accent-text-color'?: string
}
