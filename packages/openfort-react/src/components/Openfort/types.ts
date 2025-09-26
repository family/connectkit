import React, {
  ReactNode
} from 'react';
import {
  CustomAvatarProps,
  CustomTheme,
  Languages,
  Mode,
  Theme
} from '../../types';


import { AccountTypeEnum, RecoveryMethod } from '@openfort/openfort-js';
import { CoreOpenfortProviderProps } from '../../openfort/CoreOpenfortProvider';

export const routes = {
  PROVIDERS: 'providers',
  SOCIAL_PROVIDERS: 'socialProviders',

  LOADING: 'loading',
  RECOVER: 'recover',

  EMAIL_LOGIN: 'emailLogin',
  EMAIL_SIGNUP: 'emailSignup',
  FORGOT_PASSWORD: 'forgotPassword',
  EMAIL_VERIFICATION: 'emailVerification',
  LINK_EMAIL: 'linkEmail',

  ONBOARDING: 'onboarding',
  ABOUT: 'about',

  CONNECTORS: 'connectors',
  MOBILECONNECTORS: 'mobileConnectors',


  CONNECT: 'connect',
  DOWNLOAD: 'download',
  PROFILE: 'profile',
  SWITCHNETWORKS: 'switchNetworks',
} as const;

export enum UIAuthProvider {
  GOOGLE = "google",
  TWITTER = "twitter",
  FACEBOOK = "facebook",

  DISCORD = "discord",
  // EPIC_GAMES = "epic_games",
  // LINE = "line",
  // TELEGRAM = "telegram", // Telegram is not working yet

  // Extended Providers
  EMAIL = "email",
  WALLET = "wallet",
  GUEST = "guest",
}

export const socialProviders = [
  UIAuthProvider.GOOGLE,
  UIAuthProvider.TWITTER,
  UIAuthProvider.FACEBOOK,
  UIAuthProvider.DISCORD,
]

type PolicyConfig = string | Record<number, string>;

type CommonWalletConfig = {
  /** Publishable key for the Shield API. */
  shieldPublishableKey: string;
  /** Policy ID (pol_...) for the embedded signer. */
  ethereumProviderPolicyId?: PolicyConfig;
  accountType?: AccountTypeEnum;
  debug?: boolean;
}

type EncryptionSession =
  | {
    /** Function to retrieve an encryption session using a session ID. */
    getEncryptionSession?: (accessToken: string) => Promise<string>;
    createEncryptedSessionEndpoint?: never;
  }
  | {
    /** API endpoint for creating an encrypted session. */
    getEncryptionSession?: never;
    createEncryptedSessionEndpoint?: string;
  };

/**
 * Configuration for wallet recovery behaviour.
 *
 * @remarks
 * Automatic recovery requires an encryption session. Password-based recovery can use either
 * an encryption session or a `shieldEncryptionKey`. Encryption sessions may be supplied via
 * the `createEncryptedSessionEndpoint` endpoint or the `getEncryptionSession` callback.
 */
export type OpenfortWalletConfig = CommonWalletConfig & EncryptionSession;

export type OpenfortUIOptions = {
  linkWalletOnSignUp?: boolean;

  authProviders: UIAuthProvider[];
  skipEmailVerification?: boolean;
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  logo?: React.ReactNode;
};

export type OpenfortSDKOptions = {
  overrides?: CoreOpenfortProviderProps['overrides'];
}

export type WalletRecoveryOptions = {
  allowedMethods?: RecoveryMethod[];
  defaultMethod?: RecoveryMethod;
}

export type ConnectUIOptions = {
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
  hideBalance?: boolean;
  hideTooltips?: boolean;
  hideRecentBadge?: boolean;
  walletConnectCTA?: 'link' | 'modal' | 'both';
  /** Avoids layout shift when the Openfort modal is open by adding padding to the body. */
  avoidLayoutShift?: boolean;
  /** Automatically embeds the Google font of the current theme. Does not work with custom themes. */
  embedGoogleFonts?: boolean;
  truncateLongENSAddress?: boolean;
  walletConnectName?: string;
  reducedMotion?: boolean;
  disclaimer?: ReactNode | string;
  /** Buffer polyfill, needed for bundlers that do not provide Node polyfills (e.g. CRA, Vite, etc.). */
  bufferPolyfill?: boolean;
  customAvatar?: React.FC<CustomAvatarProps>;
  initialChainId?: number;
  enforceSupportedChains?: boolean;
  /** Blur intensity applied to the background when the modal is open. */
  overlayBlur?: number;
  walletRecovery?: WalletRecoveryOptions;

} & Partial<OpenfortUIOptions>;

type WalletRecoveryOptionsExtended = {
  allowedMethods: RecoveryMethod[];
  defaultMethod: RecoveryMethod;
};

export type OpenfortUIOptionsExtended = {
  theme: Theme;
  mode: Mode;
  customTheme?: CustomTheme;
  language?: Languages;
  hideBalance?: boolean;
  hideTooltips?: boolean;
  hideQuestionMarkCTA?: boolean;
  hideNoWalletCTA?: boolean;
  hideRecentBadge?: boolean;
  walletConnectCTA?: 'link' | 'modal' | 'both';
  /** Avoids layout shift when the Openfort modal is open by adding padding to the body. */
  avoidLayoutShift?: boolean;
  /** Automatically embeds the Google font of the current theme. Does not work with custom themes. */
  embedGoogleFonts?: boolean;
  truncateLongENSAddress?: boolean;
  walletConnectName?: string;
  reducedMotion?: boolean;
  disclaimer?: ReactNode | string;
  /** Buffer polyfill, needed for bundlers that do not provide Node polyfills (e.g. CRA, Vite, etc.). */
  bufferPolyfill?: boolean;
  customAvatar?: React.FC<CustomAvatarProps>;
  initialChainId?: number;
  enforceSupportedChains?: boolean;
  ethereumOnboardingUrl?: string;
  walletOnboardingUrl?: string;
  /** Disable redirect to the SIWE page after a wallet is connected. */
  disableSiweRedirect?: boolean;
  /** Blur intensity applied to the background when the modal is open. */
  overlayBlur?: number;
  walletRecovery: WalletRecoveryOptionsExtended;
} & OpenfortUIOptions;
