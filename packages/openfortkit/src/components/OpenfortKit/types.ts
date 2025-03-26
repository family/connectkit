import React, {
  ReactNode,
  createContext
} from 'react';
import {
  CustomAvatarProps,
  CustomTheme,
  Languages,
  Mode,
  Theme,
} from '../../types';


import { OAuthProvider, RecoveryMethod } from '@openfort/openfort-js';
import { ValueOf } from 'viem/_types/types/utils';
import {
  useConnectCallbackProps
} from '../../hooks/useConnectCallback';
import { OpenfortProviderProps } from '../../openfort/OpenfortProvider';

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


type CommonEmbeddedSignerConfiguration = {
  /** Publishable key for the Shield API */
  shieldPublishableKey: string;
  /** Policy ID (pol_...) for the embedded signer */
  ethereumProviderPolicyId?: string;
  debug?: boolean;
}

type EncryptionSession =
  | {
    /** Function to retrieve an encryption session using a session ID */
    getEncryptionSession: () => Promise<string>;
    createEncryptedSessionEndpoint?: never;
  }
  | {
    /** API endpoint for creating an encrypted session */
    createEncryptedSessionEndpoint: string;
    getEncryptionSession?: never;
  };

/**
 * Configuration for automatic recovery, which requires an encryption session.
 */
type AutomaticRecoveryEmbeddedSignerConfiguration = {
  /** Specifies that the recovery method is automatic */
  recoveryMethod: RecoveryMethod.AUTOMATIC;
} & EncryptionSession;

type PasswordRecoveryEmbeddedSignerConfiguration = {
  /** Specifies that the recovery method is password-based */
  recoveryMethod: RecoveryMethod.PASSWORD;
} & (
    | (EncryptionSession & {
      shieldEncryptionKey?: never;
    })
    | {
      /** Required shield encryption key when no encryption session is used */
      shieldEncryptionKey: string;
      createEncryptedSessionEndpoint?: never;
      getEncryptionSession?: never;
    }
  );

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
type EmbeddedSignerConfiguration = CommonEmbeddedSignerConfiguration & (
  AutomaticRecoveryEmbeddedSignerConfiguration | PasswordRecoveryEmbeddedSignerConfiguration
);

export type FortWalletOptions = {
  linkWalletOnSignUp: true;
  createEmbeddedSigner?: false;
} | {
  linkWalletOnSignUp?: boolean;
  createEmbeddedSigner: true;
  embeddedSignerConfiguration: EmbeddedSignerConfiguration;
}

export type OpenfortOptions = {
  authProviders?: AuthProvider[];
  skipEmailVerification?: boolean;
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  logo?: React.ReactNode;

  openfortUrlOverrides?: OpenfortProviderProps['overrides'];
};

export type ConnectKitOptions = {
  // language?: Languages;
  hideBalance?: boolean;
  hideTooltips?: boolean;
  // hideQuestionMarkCTA?: boolean;
  // hideNoWalletCTA?: boolean;
  hideRecentBadge?: boolean;
  walletConnectCTA?: 'link' | 'modal' | 'both';
  avoidLayoutShift?: boolean; // Avoids layout shift when the ConnectKit modal is open by adding padding to the body
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
  // ethereumOnboardingUrl?: string;
  // walletOnboardingUrl?: string;
  // disableSiweRedirect?: boolean; // Disable redirect to SIWE page after a wallet is connected
  overlayBlur?: number; // Blur the background when the modal is open
} & OpenfortOptions;

export type ConnectKitOptionsExtended = {
  language?: Languages;
  hideBalance?: boolean;
  hideTooltips?: boolean;
  hideQuestionMarkCTA?: boolean;
  hideNoWalletCTA?: boolean;
  hideRecentBadge?: boolean;
  walletConnectCTA?: 'link' | 'modal' | 'both';
  avoidLayoutShift?: boolean; // Avoids layout shift when the ConnectKit modal is open by adding padding to the body
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
} & OpenfortOptions;
