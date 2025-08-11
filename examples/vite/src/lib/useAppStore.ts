import { AuthProvider, OpenfortKitProvider, RecoveryMethod } from "@openfort/react";
import { create } from "zustand";

type EditingEntity = {
  id: string,
}

const defaultProviderOptions: Parameters<typeof OpenfortKitProvider>[0] = {

  // Set the publishable key of your OpenfortKit account. This field is required.
  publishableKey: import.meta.env.VITE_PUBLISHABLE_KEY,

  uiConfig: {
    theme: "auto",
    mode: undefined,
    customTheme: undefined,
    authProviders: [
      AuthProvider.EMAIL,
      AuthProvider.GUEST,
      AuthProvider.WALLET,
      AuthProvider.GOOGLE,
      AuthProvider.FACEBOOK,
      AuthProvider.TWITTER,
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
    initialChainId: undefined,
    logo: undefined,
    openfortUrlOverrides: undefined,
    overlayBlur: undefined,
    privacyPolicyUrl: undefined,
    termsOfServiceUrl: undefined,
    reducedMotion: undefined,
    skipEmailVerification: undefined,
    truncateLongENSAddress: undefined,
    walletConnectCTA: undefined,
    linkWalletOnSignUp: undefined,
  },

  // Set the wallet configuration. In this example, we will be using the embedded signer.
  walletConfig: {
    shieldPublishableKey: import.meta.env.VITE_SHIELD_PUBLISHABLE_KEY,

    recoveryMethod: RecoveryMethod.AUTOMATIC,

    ethereumProviderPolicyId: import.meta.env.VITE_POLICY_ID,

    debug: false,
    getEncryptionSession: undefined, // Optional function to get the encryption session
    // shieldEncryptionKey: undefined, // Optional encryption key for the shield

    createEncryptedSessionEndpoint: "http://localhost:3110/api/protected-create-encryption-session",
  },
  onConnect: undefined,
  onDisconnect: undefined,

  debugMode: true
}

interface Store {
  providerOptions: Parameters<typeof OpenfortKitProvider>[0],
  setProviderOptions: (options: Parameters<typeof OpenfortKitProvider>[0]) => void,

  editingEntity: EditingEntity | null,
  setEditingEntity: (entity: EditingEntity | null) => void,
}

export const useAppStore = create<Store>((set) => ({
  providerOptions: defaultProviderOptions,
  setProviderOptions: (options) => set({ providerOptions: options }),
  editingEntity: null,
  setEditingEntity: (entity) => set({ editingEntity: entity }),
}));
