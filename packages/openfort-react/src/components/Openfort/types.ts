import type { AccountTypeEnum, RecoveryMethod } from '@openfort/openfort-js'
import type React from 'react'
import type { ReactNode } from 'react'
import type { CountryData, CountryIso2, CountrySelectorProps } from 'react-international-phone'
import type { Hex } from 'viem'
import type { getAssets } from 'viem/_types/experimental/erc7811/actions/getAssets'
import type { UserWallet } from '../../hooks/openfort/useWallets'
import type { UserAccount } from '../../openfortCustomTypes'
import type { CustomAvatarProps, CustomTheme, Languages, Mode, Theme } from '../../types'

export const routes = {
  PROVIDERS: 'providers',
  SOCIAL_PROVIDERS: 'socialProviders',

  LOADING: 'loading',
  LOAD_WALLETS: 'loadWallets',
  RECOVER_WALLET: 'recoverWallets',
  SELECT_WALLET_TO_RECOVER: 'selectWalletToRecover',
  CREATE_WALLET: 'createWallet',
  CONNECTED_SUCCESS: 'connectedSuccess',

  CREATE_GUEST_USER: 'createGuestUser',
  EMAIL_LOGIN: 'emailLogin',
  EMAIL_OTP: 'emailOtp',
  PHONE_OTP: 'phoneOtp',
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
  CONNECTED: 'connected',
  PROFILE: 'profile',
  SWITCHNETWORKS: 'switchNetworks',
  LINKED_PROVIDER: 'linkedProvider',
  LINKED_PROVIDERS: 'linkedProviders',
  REMOVE_LINKED_PROVIDER: 'removeLinkedProvider',
  EXPORT_KEY: 'exportKey',

  NO_ASSETS_AVAILABLE: 'noAssetsAvailable',
  ASSET_INVENTORY: 'assetInventory',

  SEND: 'send',
  SEND_TOKEN_SELECT: 'sendTokenSelect',
  SEND_CONFIRMATION: 'sendConfirmation',
  RECEIVE: 'receive',
  BUY: 'buy',
  BUY_TOKEN_SELECT: 'buyTokenSelect',
  BUY_SELECT_PROVIDER: 'buySelectProvider',
  BUY_PROCESSING: 'buyProcessing',
  BUY_COMPLETE: 'buyComplete',
  BUY_PROVIDER_SELECT: 'buyProviderSelect',
} as const

type AllRoutes = (typeof routes)[keyof typeof routes]

export const notStoredInHistoryRoutes: AllRoutes[] = [
  routes.LOADING,
  routes.CONNECTED_SUCCESS,
  routes.ONBOARDING,
  routes.ABOUT,
  routes.LOAD_WALLETS,
  routes.CREATE_GUEST_USER,
]

type ConnectOptions =
  | {
      connectType: 'link' | 'connect' | 'linkIfUserConnectIfNoUser'
    }
  | {
      connectType: 'recover'
      wallet: UserWallet
    }

// export type ConnectType = ConnectOptions['connectType']

type RoutesWithOptions =
  | ({ route: typeof routes.CONNECTORS } & ConnectOptions)
  | ({ route: typeof routes.CONNECT } & ConnectOptions)
  | { route: typeof routes.RECOVER_WALLET; wallet: UserWallet }
  | { route: typeof routes.LINKED_PROVIDER; provider: UserAccount }
  | { route: typeof routes.REMOVE_LINKED_PROVIDER; provider: UserAccount }

export type RoutesWithoutOptions = {
  route: Exclude<AllRoutes, RoutesWithOptions['route']>
}

// RouteOptions can be either routes without options or routes with options (both objects)
export type RouteOptions = RoutesWithoutOptions | RoutesWithOptions

// SetRouteOptions can be either a RouteOptions object or just the route string for routes without options
export type SetRouteOptions = RouteOptions | RoutesWithoutOptions['route']

export enum UIAuthProvider {
  GOOGLE = 'google',
  TWITTER = 'twitter',
  X = 'twitter',
  FACEBOOK = 'facebook',

  DISCORD = 'discord',
  // EPIC_GAMES = "epic_games",
  // LINE = "line",
  // TELEGRAM = "telegram", // Telegram is not working yet
  APPLE = 'apple',

  // Extended Providers
  EMAIL_PASSWORD = 'emailPassword',
  EMAIL_OTP = 'emailOtp',
  PHONE = 'phone',
  WALLET = 'wallet',
  GUEST = 'guest',
}

export type ErrorMessage = string | React.ReactNode | null

export const socialProviders = [
  UIAuthProvider.GOOGLE,
  UIAuthProvider.TWITTER,
  UIAuthProvider.FACEBOOK,
  UIAuthProvider.DISCORD,
  UIAuthProvider.APPLE,
]

export enum LinkWalletOnSignUpOption {
  OPTIONAL = 'optional',
  REQUIRED = 'required',
  DISABLED = 'disabled',
}

type PolicyConfig = string | Record<number, string>

type CommonWalletConfig = {
  /** Publishable key for the Shield API. */
  shieldPublishableKey: string
  /** Policy ID (pol_...) for the embedded signer. */
  ethereumProviderPolicyId?: PolicyConfig
  accountType?: AccountTypeEnum
  /** @deprecated Use `debugMode` prop instead. */
  debug?: boolean
  recoverWalletAutomaticallyAfterAuth?: boolean
  assets?: {
    [chainId: number]: Hex[]
  }
}

export type GetEncryptionSessionParams = {
  accessToken: string
  otpCode?: string
  userId: string
}

type EncryptionSession =
  | {
      /** Function to retrieve an encryption session using a session ID. */
      getEncryptionSession?: ({ accessToken, otpCode, userId }: GetEncryptionSessionParams) => Promise<string>
      createEncryptedSessionEndpoint?: never
    }
  | {
      /** API endpoint for creating an encrypted session. */
      getEncryptionSession?: never
      createEncryptedSessionEndpoint?: string
    }

export type RequestWalletRecoverOTPParams = {
  accessToken: string
  userId: string
}

type RecoverWithOTP =
  | {
      /** Function to recover a wallet with otp. */
      requestWalletRecoverOTP?: ({
        accessToken,
        userId,
        email,
        phone,
      }: {
        accessToken: string
        userId: string
        email?: string
        phone?: string
      }) => Promise<void>
      requestWalletRecoverOTPEndpoint?: never
    }
  | {
      /** API endpoint for recovering a wallet with otp. */
      requestWalletRecoverOTP?: never
      requestWalletRecoverOTPEndpoint?: string
    }

export type DebugModeOptions = {
  openfortReactDebugMode?: boolean
  openfortCoreDebugMode?: boolean
  shieldDebugMode?: boolean
}

/**
 * Configuration for wallet recovery behaviour.
 *
 * @remarks
 * Automatic recovery requires an encryption session, which may be supplied via
 * the `createEncryptedSessionEndpoint` endpoint or the `getEncryptionSession` callback.
 * Password-based and passkey-based recovery methods do not require encryption sessions.
 */
export type OpenfortWalletConfig = CommonWalletConfig & EncryptionSession & RecoverWithOTP

type OpenfortUIOptions = {
  linkWalletOnSignUp?: LinkWalletOnSignUpOption

  authProviders: UIAuthProvider[]
  authProvidersLength?: number

  skipEmailVerification?: boolean
  termsOfServiceUrl?: string
  privacyPolicyUrl?: string
  logo?: React.ReactNode
}

type WalletRecoveryOptions = {
  allowedMethods?: RecoveryMethod[]
  defaultMethod?: RecoveryMethod
}

export type PhoneConfig = {
  /**
   * @description Default country value (iso2).
   * @default "us"
   */
  defaultCountry?: CountryIso2
  /**
   * @description Array of available countries for guessing.
   * @default defaultCountries // full country list
   */
  countries?: CountryData[]
  /**
   * @description Countries to display at the top of the list of dropdown options.
   * @default []
   */
  preferredCountries?: CountryIso2[]
  /**
   * @description Disable country guess on value change.
   * @default false
   */
  disableCountryGuess?: boolean
  /**
   * @description
   * Disable dial code prefill on initialization.
   * Dial code prefill works only when "empty" phone value have been provided.
   * @default false
   */
  disableDialCodePrefill?: boolean
  /**
   * @description
   * Always display the dial code.
   * Dial code can't be removed/changed by keyboard events, but it can be changed by pasting another country phone value.
   * @default false
   */
  forceDialCode?: boolean
  /**
   * @description Display phone value will not include passed *dialCode* and *prefix* if set to *true*.
   * @ignore *forceDialCode* value will be ignored.
   * @default false
   */
  disableDialCodeAndPrefix?: boolean
  /**
   * @description Disable phone value mask formatting. All formatting characters will not be displayed, but the mask length will be preserved.
   * @default false
   */
  disableFormatting?: boolean
  /**
   * @description Hide the dropdown icon. Make country selection not accessible.
   * @default false
   */
  hideDropdown?: CountrySelectorProps['hideDropdown']
  /**
   * @description
   * Show prefix and dial code between country selector and phone input.
   * Works only when *disableDialCodeAndPrefix* is *true*
   * @default false
   */
  showDisabledDialCodeAndPrefix?: boolean
  /**
   * @description Disable auto focus on input field after country select.
   * @default false
   */
  disableFocusAfterCountrySelect?: boolean
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
  buyWithCardUrl?: string
  buyFromExchangeUrl?: string
  buyTroubleshootingUrl?: string
  phoneConfig?: PhoneConfig
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
  buyWithCardUrl?: string
  buyFromExchangeUrl?: string
  buyTroubleshootingUrl?: string
  walletRecovery: WalletRecoveryOptionsExtended
  phoneConfig?: PhoneConfig
} & OpenfortUIOptions

// export type Asset = getAssets.Asset<false>
export type Asset =
  | {
      type: 'native'
      address?: 'native'
      balance: bigint
      metadata?: {
        decimals?: number
        symbol: string
        name?: never
        fiat: {
          value: number
          currency: string
        }
      }
      raw?: getAssets.NativeAsset
    }
  | {
      type: 'erc20'
      address: Hex
      balance: bigint
      metadata: {
        decimals?: number
        symbol: string
        name: string
        fiat?: {
          value: number
          currency: string
        }
      }
      raw?: getAssets.Erc20Asset
    }

export type SendFormState = {
  recipient: string
  amount: string
  asset: Asset
}

export const defaultSendFormState: SendFormState = {
  recipient: '',
  amount: '',
  asset: {
    type: 'native',
    balance: BigInt(0),
  },
}

export type BuyProviderId = 'moonpay' | 'coinbase' | 'stripe'

export type BuyFormState = {
  amount: string
  currency: string
  asset: Asset
  providerId: BuyProviderId
}

export const defaultBuyFormState: BuyFormState = {
  amount: '10.00',
  currency: 'USD',
  asset: {
    type: 'native',
    balance: BigInt(0),
  },
  providerId: 'coinbase',
}
