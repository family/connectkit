export {
  AccountTypeEnum,
  AuthInitPayload,
  AuthPlayerResponse,
  AuthResponse,
  EmbeddedAccount,
  OpenfortEventMap,
  OpenfortEvents,
  openfortEvents,
  RecoveryMethod,
  RecoveryParams,
  SignedMessagePayload,
} from '@openfort/openfort-js'
export { default as Avatar } from './components/Common/Avatar'
export { default as ChainIcon } from './components/Common/Chain'
export { OpenfortButton } from './components/ConnectButton'
export { OpenfortProvider } from './components/Openfort/OpenfortProvider'
export { LinkWalletOnSignUpOption, UIAuthProvider as AuthProvider } from './components/Openfort/types'
export { embeddedWalletId } from './constants/openfort'
export { default as getDefaultConfig } from './defaultConfig'
export { default as getDefaultConnectors } from './defaultConnectors'
export { useAuthCallback } from './hooks/openfort/auth/useAuthCallback'
export { useEmailAuth } from './hooks/openfort/auth/useEmailAuth'
export { useGuestAuth } from './hooks/openfort/auth/useGuestAuth'
export { useOAuth } from './hooks/openfort/auth/useOAuth'
export { useSignOut } from './hooks/openfort/auth/useSignOut'
export { useWalletAuth } from './hooks/openfort/auth/useWalletAuth'
export {
  type SignAuthorizationParameters,
  type SignAuthorizationReturnType,
  use7702Authorization,
} from './hooks/openfort/use7702Authorization'
export { useConnectWithSiwe } from './hooks/openfort/useConnectWithSiwe'
export { useGrantPermissions } from './hooks/openfort/useGrantPermissions'
export { useUI } from './hooks/openfort/useUI'
export { useUser } from './hooks/openfort/useUser'
export { UserWallet, useWallets } from './hooks/openfort/useWallets'
export { useChainIsSupported } from './hooks/useChainIsSupported'
export { useChains } from './hooks/useChains'
export { useOpenfortCore as useOpenfort } from './openfort/useOpenfort'
export type {
  All,
  CustomAvatarProps,
  CustomTheme,
  Languages,
  Mode,
  OpenfortHookOptions,
  OpenfortOptions,
  OpenfortWalletConfig,
  Theme,
} from './types'
export {
  OAuthProvider,
  OpenfortError,
  OpenfortErrorType,
  SDKOverrides,
  ThirdPartyOAuthProvider,
} from './types'
export { OPENFORT_VERSION } from './version'
export { wallets } from './wallets'
