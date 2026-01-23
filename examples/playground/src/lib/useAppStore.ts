import { AuthProvider, type OpenfortProvider, RecoveryMethod } from '@openfort/react'
import { beamTestnet, polygonAmoy } from 'viem/chains'
import { create } from 'zustand'
import { customPageComponents } from '@/components/customPageComponents'

type EditingEntity = {
  id: string
}

const viewCustomComponents = false

const defaultProviderOptions: Parameters<typeof OpenfortProvider>[0] = {
  // Set the publishable key of your Openfort account. This field is required.
  publishableKey: import.meta.env.VITE_OPENFORT_PUBLISHABLE_KEY,

  uiConfig: {
    theme: 'auto',
    mode: undefined,
    customTheme: undefined,
    authProviders: [
      // AuthProvider.EMAIL_PASSWORD,
      AuthProvider.EMAIL_OTP,
      AuthProvider.PHONE,
      AuthProvider.GUEST,
      AuthProvider.WALLET,
      AuthProvider.GOOGLE,
      AuthProvider.FACEBOOK,
      AuthProvider.TWITTER,
      AuthProvider.DISCORD,
    ],
    phoneConfig: {
      defaultCountry: 'es',
    },
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

    // linkWalletOnSignUp: LinkWalletOnSignUpOption.OPTIONAL,
    walletRecovery: {
      defaultMethod: RecoveryMethod.AUTOMATIC,
      allowedMethods: [RecoveryMethod.PASSWORD, RecoveryMethod.AUTOMATIC, RecoveryMethod.PASSKEY],
    },
    customPageComponents: viewCustomComponents ? customPageComponents : undefined,
  },

  // Set the wallet configuration. In this example, we will be using the embedded signer.
  walletConfig: {
    shieldPublishableKey: import.meta.env.VITE_SHIELD_PUBLISHABLE_KEY,

    ethereumProviderPolicyId: {
      [polygonAmoy.id]: import.meta.env.VITE_POLYGON_POLICY_ID!,
      [beamTestnet.id]: import.meta.env.VITE_BEAM_POLICY_ID!,
    },

    // If you want to use AUTOMATIC embedded wallet recovery, an encryption session is required.
    // See: https://www.openfort.io/docs/products/embedded-wallet/react-native/quickstart/automatic
    // For backend setup, check: https://github.com/openfort-xyz/openfort-backend-quickstart
    getEncryptionSession: undefined, // Optional function to get the encryption session
    createEncryptedSessionEndpoint:
      import.meta.env.VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT ||
      'https://create-next-app.openfort.io/api/protected-create-encryption-session',
    recoverWalletAutomaticallyAfterAuth: undefined,
    accountType: undefined,
    assets: {
      [polygonAmoy.id]: ['0xef147ed8bb07a2a0e7df4c1ac09e96dec459ffac'],
    },
    requestWalletRecoverOTP: async ({ userId, email, phone }) => {
      await fetch(import.meta.env.VITE_REQUEST_WALLET_RECOVER_OTP_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, email, phone }),
      })
    },
    // requestWalletRecoverOTPEndpoint: import.meta.env.VITE_REQUEST_WALLET_RECOVER_OTP_ENDPOINT,
  },
  onConnect: undefined,
  onDisconnect: undefined,

  overrides: {
    backendUrl: import.meta.env.VITE_API_URL,
    crypto: undefined,
    storage: undefined,
    iframeUrl: import.meta.env.VITE_IFRAME_API_URL,
    shieldUrl: import.meta.env.VITE_SHIELD_URL,
  },
  thirdPartyAuth: undefined,
  debugMode: {
    openfortReactDebugMode: true,
    openfortCoreDebugMode: true,
    shieldDebugMode: true,
    // debugRoutes: true,
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
