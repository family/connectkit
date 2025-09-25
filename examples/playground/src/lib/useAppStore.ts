import { AuthProvider, OpenfortProvider, RecoveryMethod } from "@openfort/react";
import { beamTestnet, polygonAmoy } from "viem/chains";
import { create } from "zustand";

type EditingEntity = {
  id: string,
}

const defaultProviderOptions: Parameters<typeof OpenfortProvider>[0] = {

  // Set the publishable key of your Openfort account. This field is required.
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
    overlayBlur: undefined,
    privacyPolicyUrl: undefined,
    termsOfServiceUrl: undefined,
    reducedMotion: undefined,
    skipEmailVerification: undefined,
    truncateLongENSAddress: undefined,
    walletConnectCTA: undefined,
    linkWalletOnSignUp: undefined,
    walletRecovery: {
      defaultMethod: RecoveryMethod.PASSKEY,
      allowedMethods: [RecoveryMethod.PASSWORD, RecoveryMethod.AUTOMATIC, RecoveryMethod.PASSKEY],
    }
  },

  // Set the wallet configuration. In this example, we will be using the embedded signer.
  walletConfig: {
    shieldPublishableKey: import.meta.env.VITE_SHIELD_PUBLISHABLE_KEY,

    ethereumProviderPolicyId: {
      [polygonAmoy.id]: import.meta.env.VITE_POLYGON_POLICY_ID!,
      [beamTestnet.id]: import.meta.env.VITE_BEAM_POLICY_ID!,
    },

    debug: false,
    // getEncryptionSession: undefined, // Optional function to get the encryption session

    createEncryptedSessionEndpoint: import.meta.env.VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT,
  },
  onConnect: undefined,
  onDisconnect: undefined,

  debugMode: true
}

interface Store {
  providerOptions: Parameters<typeof OpenfortProvider>[0],
  setProviderOptions: (options: Parameters<typeof OpenfortProvider>[0]) => void,

  editingEntity: EditingEntity | null,
  setEditingEntity: (entity: EditingEntity | null) => void,
}

export const useAppStore = create<Store>((set) => ({
  providerOptions: defaultProviderOptions,
  setProviderOptions: (options) => set({ providerOptions: options }),
  editingEntity: null,
  setEditingEntity: (entity) => set({ editingEntity: entity }),
}));
