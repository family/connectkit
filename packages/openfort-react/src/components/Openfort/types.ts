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

export enum AuthProvider {
  GOOGLE = "google",
  TWITTER = "twitter",
  FACEBOOK = "facebook",

  // DISCORD = "discord",
  // EPIC_GAMES = "epic_games",
  // LINE = "line",
  // TELEGRAM = "telegram", // Telegram is not working yet

  // Extended Providers
  EMAIL = "email",
  WALLET = "wallet",
  GUEST = "guest",
}

export const socialProviders = [
  AuthProvider.GOOGLE,
  AuthProvider.TWITTER,
  AuthProvider.FACEBOOK,
]

type PolicyConfig = string | Record<number, string>;

type CommonWalletConfig = {
  /** Publishable key for the Shield API */
  shieldPublishableKey: string;
  /** Policy ID (pol_...) for the embedded signer */
  ethereumProviderPolicyId?: PolicyConfig;
  accountType?: AccountTypeEnum;
  debug?: boolean;
}

type EncryptionSession =
  | {
    /** Function to retrieve an encryption session using a session ID */
    getEncryptionSession?: () => Promise<string>;
    createEncryptedSessionEndpoint?: never;
  }
  | {
    /** API endpoint for creating an encrypted session */
    getEncryptionSession?: never;
    createEncryptedSessionEndpoint?: string;
  };

/**
 * Configuration for automatic recovery.
 * - An encryption session is required.
 * 
 * Configuration for password-based recovery.
 * - An encryption session, OR
 * - A `shieldEncryptionKey` without an encryption session.
 * 
 * Encryption session can be created using either:
 * - `createEncryptedSessionEndpoint` as a string, OR
 * - `getEncryptionSession.` as a function that returns a promise.
 */

export type OpenfortWalletConfig = CommonWalletConfig & EncryptionSession;

export type OpenfortUIOptions = {
  linkWalletOnSignUp?: boolean;

  authProviders: AuthProvider[];
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
  avoidLayoutShift?: boolean; // Avoids layout shift when the Openfort modal is open by adding padding to the body
  embedGoogleFonts?: boolean; // Automatically embeds Google Font of the current theme. Does not work with custom themes
  truncateLongENSAddress?: boolean;
  walletConnectName?: string;
  reducedMotion?: boolean;
  disclaimer?: ReactNode | string;
  /** Buffer Polyfill, needed for bundlers that don't provide Node polyfills (e.g CRA, Vite, etc.) */
  bufferPolyfill?: boolean;
  customAvatar?: React.FC<CustomAvatarProps>;
  initialChainId?: number;
  enforceSupportedChains?: boolean;
  overlayBlur?: number; // Blur the background when the modal is open
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
  avoidLayoutShift?: boolean; // Avoids layout shift when the Openfort modal is open by adding padding to the body
  embedGoogleFonts?: boolean; // Automatically embeds Google Font of the current theme. Does not work with custom themes
  truncateLongENSAddress?: boolean;
  walletConnectName?: string;
  reducedMotion?: boolean;
  disclaimer?: ReactNode | string;
  bufferPolyfill?: boolean;
  customAvatar?: React.FC<CustomAvatarProps>;
  initialChainId?: number;
  enforceSupportedChains?: boolean;
  ethereumOnboardingUrl?: string;
  walletOnboardingUrl?: string;
  disableSiweRedirect?: boolean; // Disable redirect to SIWE page after a wallet is connected
  overlayBlur?: number; // Blur the background when the modal is open
  walletRecovery: WalletRecoveryOptionsExtended;
} & OpenfortUIOptions;
