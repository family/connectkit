import {
  AuthProvider,
  type CustomTheme,
  LinkWalletOnSignUpOption,
  type OpenfortProvider,
  RecoveryMethod,
} from '@openfort/react'
import { beamTestnet, polygonAmoy } from 'viem/chains'
import { create } from 'zustand'

type EditingEntity = {
  id: string
}

const customTheme: CustomTheme = {
  '--ck-font-family': 'system-ui, -apple-system, sans-serif',
  '--ck-border-radius': '12px',
  '--ck-connectbutton-font-size': '16px',
  '--ck-connectbutton-border-radius': '12px',
  '--ck-connectbutton-color': '#000000',
  '--ck-connectbutton-background': 'linear-gradient(45deg,rgba(129, 255, 217, 1) 0%, rgba(17, 208, 151, 1) 100%)',
  '--ck-connectbutton-box-shadow': '0 0 12px 0px rgba(96, 205, 154, 1)',
  '--ck-connectbutton-hover-background': 'linear-gradient(45deg, rgba(17, 208, 151, 1) 0%,rgba(129, 255, 217, 1) 100%)',
  '--ck-connectbutton-active-background':
    'linear-gradient(45deg,rgba(129, 255, 217, 1) 0%, rgba(17, 208, 151, 1) 100%)',
  '--ck-connectbutton-balance-color': '#ffffff',
  '--ck-connectbutton-balance-background': '#1F2023',
  '--ck-connectbutton-balance-box-shadow': 'inset 0 0 0 1px #313235',
  '--ck-connectbutton-balance-hover-background': '#313235',
  '--ck-connectbutton-balance-active-background': '#414144',
  '--ck-primary-button-border-radius': '12px',
  '--ck-primary-button-color': '#ffffff',
  '--ck-primary-button-background': 'linear-gradient(45deg,rgba(129, 255, 217, .02) 0%, rgba(17, 208, 151, 0) 100%)',
  '--ck-primary-button-box-shadow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
  '--ck-primary-button-hover-background':
    'linear-gradient(45deg,rgba(129, 255, 217, 1) 0%, rgba(17, 208, 151, 1) 100%)',
  '--ck-secondary-button-border-radius': '12px',
  '--ck-secondary-button-color': '',
  '--ck-secondary-button-background': 'linear-gradient(45deg,rgba(129, 255, 217, .02) 0%, rgba(17, 208, 151, 0) 100%)',
  '--ck-secondary-button-box-shadow': '',
  '--ck-secondary-button-hover-background':
    'linear-gradient(45deg,rgba(129, 255, 217, 1) 0%, rgba(17, 208, 151, 1) 100%)',
  '--ck-overlay-background': 'rgba(0, 0, 0, 0.7)',
  '--ck-modal-box-shadow': '0 0 100px 0px rgba(96, 205, 154, .2)',
  '--ck-focus-color': '#000000',
  '--ck-body-color': '#ffffff',
  '--ck-body-color-muted': '#545454',
  '--ck-body-color-muted-hover': '#ffffff',
  '--ck-body-background': '#181919',
  '--ck-body-background-transparent': 'rgba(31, 32, 35, 0)',
  '--ck-body-background-secondary': 'rgba(129, 255, 217, .1)',
  '--ck-body-background-secondary-hover-background': '#e0e4eb',
  '--ck-body-background-secondary-hover-outline': 'rgba(255, 255, 255, 0.02)',
  '--ck-body-background-tertiary': '#313235',
  '--ck-tertiary-border-radius': '12px',
  '--ck-tertiary-box-shadow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.02)',
  '--ck-body-action-color': '#8B8F97',
  '--ck-body-divider': 'rgba(255,255,255,0.1)',
  '--ck-body-color-danger': '#ff2929',
  '--ck-body-color-valid': '#ffffff',
  '--ck-body-disclaimer-background': '#2B2D31',
  '--ck-body-disclaimer-box-shadow': 'none',
  '--ck-body-disclaimer-color': '#808183',
  '--ck-body-disclaimer-link-color': '#AAABAD',
  '--ck-body-disclaimer-link-hover-color': '#ffffff',
  '--ck-copytoclipboard-stroke': '#CCCCCC',
  '--ck-tooltip-background': '#000000',
  '--ck-tooltip-background-secondary': '#000000',
  '--ck-tooltip-color': '#ffffff',
  '--ck-tooltip-shadow': '',
  '--ck-spinner-color': 'rgba(129, 255, 217, 1)',
  '--ck-dropdown-button-color': '#6C7381',
  '--ck-dropdown-button-box-shadow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
  '--ck-dropdown-button-background': '#313235',
  '--ck-dropdown-pending-color': '#8B8F97',
  '--ck-dropdown-active-color': '#FFF',
  '--ck-dropdown-active-static-color': '#FFF',
  '--ck-dropdown-active-background': 'rgba(255, 255, 255, 0.07)',
  '--ck-dropdown-color': '#8B8F97',
  '--ck-dropdown-background': '#313235',
  '--ck-dropdown-box-shadow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.03)',
  '--ck-dropdown-border-radius': '8px',
  '--ck-alert-color': '#8B8F97',
  '--ck-alert-background': '#404145',
  '--ck-alert-box-shadow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.02)',
  '--ck-qr-border-radius': '24px',
  '--ck-qr-dot-color': '#ffffff',
  '--ck-qr-border-color': 'rgba(255,255,255,0.1)',
  '--ck-recent-badge-border-radius': '2px',
  '--ck-primary-button-hover-color': '#000000',
  '--ck-secondary-button-hover-color': '#000000',
  '--ck-qr-background': 'linear-gradient(90deg,rgba(129, 255, 217, .03) 0%, rgba(17, 208, 151, 0) 100%)',
  '--ck-primary-button-font-weight': '400',
  '--ck-secondary-button-font-weight': '400',
  '--ck-tertiary-button-font-weight': '400',
  '--ck-modal-heading-font-weight': '400',
  '--ck-tertiary-button-border-radius': '12px',
  '--ck-connectbutton-hover-box-shadow': '0 0 20px 0px rgba(96, 205, 154, .5)',
  '--ck-overlay-backdrop-filter': 'blur(40px)',
}

const defaultProviderOptions: Parameters<typeof OpenfortProvider>[0] = {
  // Set the publishable key of your Openfort account. This field is required.
  publishableKey: import.meta.env.VITE_PUBLISHABLE_KEY,

  uiConfig: {
    theme: 'auto',
    mode: undefined,
    customTheme,
    authProviders: [
      AuthProvider.EMAIL,
      AuthProvider.GUEST,
      AuthProvider.WALLET,
      AuthProvider.GOOGLE,
      AuthProvider.FACEBOOK,
      AuthProvider.TWITTER,
      AuthProvider.DISCORD,
    ],
    avoidLayoutShift: undefined,
    bufferPolyfill: undefined,
    customAvatar: undefined,
    disclaimer: undefined,
    walletConnectName: undefined,
    embedGoogleFonts: undefined,
    enforceSupportedChains: undefined,
    hideBalance: undefined,
    hideRecentBadge: undefined,
    hideTooltips: undefined,
    logo: undefined,
    overlayBlur: undefined,
    privacyPolicyUrl: undefined,
    termsOfServiceUrl: undefined,
    reducedMotion: undefined,
    skipEmailVerification: undefined,
    truncateLongENSAddress: undefined,
    walletConnectCTA: undefined,
    authProvidersLength: undefined,

    linkWalletOnSignUp: LinkWalletOnSignUpOption.OPTIONAL,
    walletRecovery: {
      defaultMethod: RecoveryMethod.PASSWORD,
      allowedMethods: [RecoveryMethod.PASSWORD, RecoveryMethod.AUTOMATIC, RecoveryMethod.PASSKEY],
    },
  },

  // Set the wallet configuration. In this example, we will be using the embedded signer.
  walletConfig: {
    shieldPublishableKey: import.meta.env.VITE_SHIELD_PUBLISHABLE_KEY,

    ethereumProviderPolicyId: {
      [polygonAmoy.id]: import.meta.env.VITE_POLYGON_POLICY_ID!,
      [beamTestnet.id]: import.meta.env.VITE_BEAM_POLICY_ID!,
    },

    getEncryptionSession: undefined, // Optional function to get the encryption session
    createEncryptedSessionEndpoint: import.meta.env.VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT,
    recoverWalletAutomaticallyAfterAuth: undefined,
    accountType: undefined,
    assets: {
      [polygonAmoy.id]: ['0xef147ed8bb07a2a0e7df4c1ac09e96dec459ffac'],
    },
  },
  onConnect: undefined,
  onDisconnect: undefined,

  overrides: {
    backendUrl: undefined,
    crypto: undefined,
    storage: undefined,
    iframeUrl: undefined,
    shieldUrl: undefined,
  },
  thirdPartyAuth: undefined,
  debugMode: {
    openfortReactDebugMode: true,
    openfortCoreDebugMode: true,
    shieldDebugMode: true,
  },
}

interface Store {
  providerOptions: Parameters<typeof OpenfortProvider>[0]
  setProviderOptions: (options: Parameters<typeof OpenfortProvider>[0]) => void

  editingEntity: EditingEntity | null
  setEditingEntity: (entity: EditingEntity | null) => void
}

export const useAppStore = create<Store>((set) => ({
  providerOptions: defaultProviderOptions,
  setProviderOptions: (options) => set({ providerOptions: options }),
  editingEntity: null,
  setEditingEntity: (entity) => set({ editingEntity: entity }),
}))
