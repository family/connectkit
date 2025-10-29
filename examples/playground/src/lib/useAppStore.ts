import { AuthProvider, LinkWalletOnSignUpOption, type OpenfortProvider, RecoveryMethod } from '@openfort/react'
import { baseSepolia, beamTestnet, polygonAmoy } from 'viem/chains'
import { create } from 'zustand'

type EditingEntity = {
  id: string
}

const env = import.meta.env

const getEnvValue = (key: string) => {
  const value = env[key as keyof typeof env] as string | undefined
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

const publishableKey = getEnvValue('VITE_OPENFORT_PUBLISHABLE_KEY') ?? ''
const shieldPublishableKey = getEnvValue('VITE_OPENFORT_SHIELD_KEY') ?? ''
const shieldSessionUrl = getEnvValue('VITE_OPENFORT_SHIELD_SESSION_URL')

const polygonPolicyId = getEnvValue('VITE_OPENFORT_POLICY_POLYGON_AMOY')
const beamPolicyId = getEnvValue('VITE_OPENFORT_POLICY_BEAM_TESTNET')
const baseSepoliaPolicyId = getEnvValue('VITE_OPENFORT_POLICY_BASE_SEPOLIA')

const policyEntries = [
  [polygonAmoy.id, polygonPolicyId],
  [beamTestnet.id, beamPolicyId],
  [baseSepolia.id, baseSepoliaPolicyId],
].filter(([, value]) => Boolean(value)) as Array<[number, string]>

const ethereumPolicyConfig = policyEntries.length ? Object.fromEntries(policyEntries) : undefined

const defaultProviderOptions: Parameters<typeof OpenfortProvider>[0] = {
  // Set the publishable key of your Openfort account. This field is required.
  publishableKey,

  uiConfig: {
    theme: 'auto',
    mode: undefined,
    customTheme: undefined,
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

    linkWalletOnSignUp: LinkWalletOnSignUpOption.OPTIONAL,
    walletRecovery: {
      defaultMethod: RecoveryMethod.PASSWORD,
      allowedMethods: [RecoveryMethod.PASSWORD, RecoveryMethod.AUTOMATIC, RecoveryMethod.PASSKEY],
    },
  },

  // Set the wallet configuration. In this example, we will be using the embedded signer.
  walletConfig: {
    shieldPublishableKey,

    ethereumProviderPolicyId: ethereumPolicyConfig,

    debug: false,
    // getEncryptionSession: undefined, // Optional function to get the encryption session

    createEncryptedSessionEndpoint: shieldSessionUrl,
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
