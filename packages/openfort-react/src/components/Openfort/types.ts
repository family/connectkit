import type { AccountTypeEnum, RecoveryMethod } from '@openfort/openfort-js'
import type React from 'react'
import type { ReactNode } from 'react'
import type { CustomAvatarProps, CustomTheme, Languages, Mode, Theme } from '../../types'

export const routes = {
  PROVIDERS: 'providers',
  SOCIAL_PROVIDERS: 'socialProviders',

  LOADING: 'loading',
  RECOVER: 'recover',

  EMAIL_LOGIN: 'emailLogin',
  FORGOT_PASSWORD: 'forgotPassword',
  EMAIL_VERIFICATION: 'emailVerification',
  LINK_EMAIL: 'linkEmail',

  ONBOARDING: 'onboarding',
  ABOUT: 'about',

  CONNECTORS: 'connectors',
  MOBILECONNECTORS: 'mobileConnectors',
  CONNECT_WITH_MOBILE: 'connectWithMobile',

  CONNECT: 'connect',
  DOWNLOAD: 'download',
  PROFILE: 'profile',
  SWITCHNETWORKS: 'switchNetworks',
} as const

export enum UIAuthProvider {
  GOOGLE = 'google',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',

  DISCORD = 'discord',
  // EPIC_GAMES = "epic_games",
  // LINE = "line",
  // TELEGRAM = "telegram", // Telegram is not working yet
  APPLE = 'apple',

  // Extended Providers
  EMAIL = 'email',
  WALLET = 'wallet',
  GUEST = 'guest',
}

export const socialProviders = [
  UIAuthProvider.GOOGLE,
  UIAuthProvider.TWITTER,
  UIAuthProvider.FACEBOOK,
  UIAuthProvider.DISCORD,
  UIAuthProvider.APPLE,
]

type PolicyConfig = string | Record<number, string>

type CommonWalletConfig = {
  /** Publishable key for the Shield API. */
  shieldPublishableKey: string
  /** Policy ID (pol_...) for the embedded signer. */
  ethereumProviderPolicyId?: PolicyConfig
  accountType?: AccountTypeEnum
  debug?: boolean
  recoverWalletAutomaticallyAfterAuth?: boolean
}

type EncryptionSession =
  | {
      /** Function to retrieve an encryption session using a session ID. */
      getEncryptionSession?: (accessToken: string) => Promise<string>
      createEncryptedSessionEndpoint?: never
    }
  | {
      /** API endpoint for creating an encrypted session. */
      getEncryptionSession?: never
      createEncryptedSessionEndpoint?: string
    }

/**
 * Configuration for wallet recovery behaviour.
 *
 * @remarks
 * Automatic recovery requires an encryption session, which may be supplied via
 * the `createEncryptedSessionEndpoint` endpoint or the `getEncryptionSession` callback.
 * Password-based and passkey-based recovery methods do not require encryption sessions.
 */
export type OpenfortWalletConfig = CommonWalletConfig & EncryptionSession

type OpenfortUIOptions = {
  linkWalletOnSignUp?: boolean

  authProviders: UIAuthProvider[]
  skipEmailVerification?: boolean
  termsOfServiceUrl?: string
  privacyPolicyUrl?: string
  logo?: React.ReactNode
}

type WalletRecoveryOptions = {
  allowedMethods?: RecoveryMethod[]
  defaultMethod?: RecoveryMethod
}

export type ConnectUIOptions = {
  theme?: Theme
  mode?: Mode
  customTheme?: CustomTheme
  hideBalance?: boolean
  hideTooltips?: boolean
  hideRecentBadge?: boolean
  walletConnectCTA?: 'link' | 'modal' | 'both'
  /** Avoids layout shift when the Openfort modal is open by adding padding to the body. */
  avoidLayoutShift?: boolean
  /** Automatically embeds the Google font of the current theme. Does not work with custom themes. */
  embedGoogleFonts?: boolean
  truncateLongENSAddress?: boolean
  walletConnectName?: string
  reducedMotion?: boolean
  disclaimer?: ReactNode | string
  /** Buffer polyfill, needed for bundlers that do not provide Node polyfills (e.g. CRA, Vite, etc.). */
  bufferPolyfill?: boolean
  customAvatar?: React.FC<CustomAvatarProps>
  enforceSupportedChains?: boolean
  /** Blur intensity applied to the background when the modal is open. */
  overlayBlur?: number
  walletRecovery?: WalletRecoveryOptions
} & Partial<OpenfortUIOptions>

type WalletRecoveryOptionsExtended = {
  allowedMethods: RecoveryMethod[]
  defaultMethod: RecoveryMethod
}

export type OpenfortUIOptionsExtended = {
  theme: Theme
  mode: Mode
  customTheme?: CustomTheme
  language?: Languages
  hideBalance?: boolean
  hideTooltips?: boolean
  hideQuestionMarkCTA?: boolean
  hideNoWalletCTA?: boolean
  hideRecentBadge?: boolean
  walletConnectCTA?: 'link' | 'modal' | 'both'
  /** Avoids layout shift when the Openfort modal is open by adding padding to the body. */
  avoidLayoutShift?: boolean
  /** Automatically embeds the Google font of the current theme. Does not work with custom themes. */
  embedGoogleFonts?: boolean
  truncateLongENSAddress?: boolean
  walletConnectName?: string
  reducedMotion?: boolean
  disclaimer?: ReactNode | string
  /** Buffer polyfill, needed for bundlers that do not provide Node polyfills (e.g. CRA, Vite, etc.). */
  bufferPolyfill?: boolean
  customAvatar?: React.FC<CustomAvatarProps>
  enforceSupportedChains?: boolean
  ethereumOnboardingUrl?: string
  walletOnboardingUrl?: string
  /** Disable redirect to the SIWE page after a wallet is connected. */
  disableSiweRedirect?: boolean
  /** Blur intensity applied to the background when the modal is open. */
  overlayBlur?: number
  walletRecovery: WalletRecoveryOptionsExtended
} & OpenfortUIOptions
