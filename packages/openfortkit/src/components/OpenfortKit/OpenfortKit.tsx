import { Buffer } from 'buffer';
import React, {
  createElement,
  useEffect,
  useState
} from 'react';

import defaultTheme from '../../styles/defaultTheme';

import { RecoveryMethod } from '@openfort/openfort-js';
import { ThemeProvider } from 'styled-components';
import { ValueOf } from 'viem/_types/types/utils';
import { WagmiContext, useAccount } from 'wagmi';
import { useChainIsSupported } from '../../hooks/useChainIsSupported';
import { useChains } from '../../hooks/useChains';
import {
  useConnectCallbackProps
} from '../../hooks/useConnectCallback';
import { useConnector } from '../../hooks/useConnectors';
import { useThemeFont } from '../../hooks/useGoogleFont';
import { OpenfortProvider } from '../../openfort/OpenfortProvider';
import { isFamily } from '../../utils/wallets';
import ConnectKitModal from '../ConnectModal';
import { Web3ContextProvider } from '../contexts/web3';
import { OpenfortKitContext, ContextValue, ErrorMessage } from './context';
import { AuthProvider, ConnectKitOptions, ConnectKitOptionsExtended, FortWalletOptions, routes } from './types';
import { CustomTheme, Languages, Mode, Theme } from '../../types';

type OpenfortKitProviderProps = {
  children?: React.ReactNode;
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
  options?: ConnectKitOptions;
  debugMode?: boolean;

  publishableKey: string;
  walletConfig: FortWalletOptions;
} & useConnectCallbackProps;

/**
 * OpenfortKitProvider component provides context and configuration for OpenfortKit.
 * It must be used within a WagmiProvider.
 *
 * @param {React.ReactNode} children - The child components to be wrapped by the provider.
 * @param {string} [theme='auto'] - The theme to be used, default is 'auto'.
 * @param {string} [mode='auto'] - The mode to be used, default is 'auto'.
 * @param {CustomTheme} [customTheme] - Custom theme configuration.
 * @param {ConnectKitOptions} [options] - Additional configuration options.
 * @param {Function} [onConnect] - Callback function to be called on connect.
 * @param {Function} [onDisconnect] - Callback function to be called on disconnect.
 * @param {boolean} [debugMode=false] - Enable or disable debug mode, default is false.
 * @param {OpenfortOptions} [openfortOptions] - Options for Openfort integration.
 * @throws Will throw an error if used outside of a WagmiProvider or if nested usages are detected.
 */
export const OpenfortKitProvider = ({
  children,
  theme = 'auto',
  mode = 'auto',
  customTheme,
  options,
  onConnect,
  onDisconnect,
  debugMode = false,

  publishableKey,
  walletConfig,
}: OpenfortKitProviderProps) => {
  // OpenfortKitProvider must be within a WagmiProvider
  if (!React.useContext(WagmiContext)) {
    throw Error('OpenfortKitProvider must be within a WagmiProvider');
  }

  // Only allow for mounting OpenfortKitProvider once, so we avoid weird global
  // state collisions.
  if (React.useContext(OpenfortKitContext)) {
    throw new Error(
      'Multiple, nested usages of OpenfortKitProvider detected. Please use only one.'
    );
  }


  const chains = useChains();

  const injectedConnector = useConnector('injected');

  // Default config options
  const defaultOptions: ConnectKitOptionsExtended = {
    language: 'en-US',
    hideBalance: false,
    hideTooltips: false,
    hideQuestionMarkCTA: false,
    hideNoWalletCTA: false,
    walletConnectCTA: 'link',
    hideRecentBadge: false,
    avoidLayoutShift: true,
    embedGoogleFonts: false,
    truncateLongENSAddress: true,
    walletConnectName: undefined,
    reducedMotion: false,
    disclaimer: null,
    bufferPolyfill: true,
    customAvatar: undefined,
    initialChainId: chains?.[0]?.id,
    enforceSupportedChains: false,
    ethereumOnboardingUrl: undefined,
    walletOnboardingUrl: undefined,
    disableSiweRedirect: false,

    // Openfort options
    authProviders: [],
  };

  const opts: ConnectKitOptionsExtended = Object.assign({}, defaultOptions, options);

  if (opts.authProviders?.length === 0) {
    opts.authProviders = [
      AuthProvider.GUEST,
      AuthProvider.EMAIL,
      AuthProvider.WALLET,
    ];
  }

  if (typeof window !== 'undefined') {
    // Buffer Polyfill, needed for bundlers that don't provide Node polyfills (e.g CRA, Vite, etc.)
    if (opts.bufferPolyfill) window.Buffer = window.Buffer ?? Buffer;

    // Some bundlers may need `global` and `process.env` polyfills as well
    // Not implemented here to avoid unexpected behaviors, but leaving example here for future reference
    /*
     * window.global = window.global ?? window;
     * window.process = window.process ?? { env: {} };
     */
  }

  const [ckTheme, setTheme] = useState<Theme>(theme);
  const [ckMode, setMode] = useState<Mode>(mode);
  const [ckCustomTheme, setCustomTheme] = useState<CustomTheme | undefined>(
    customTheme ?? {}
  );
  const [ckLang, setLang] = useState<Languages>('en-US');
  const [open, setOpen] = useState<boolean>(false);
  const [connector, setConnector] = useState<ContextValue['connector']>({
    id: '',
  });
  const [route, setRoute] = useState<ValueOf<typeof routes>>(routes.LOADING);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>('');

  const [resize, onResize] = useState<number>(0);

  // Include Google Font that is needed for a themes
  if (opts.embedGoogleFonts) useThemeFont(theme);

  // Other Configuration
  useEffect(() => setTheme(theme), [theme]);
  useEffect(() => setLang(opts.language || 'en-US'), [opts.language]);
  useEffect(() => setErrorMessage(null), [route, open]);

  // Check if chain is supported, elsewise redirect to switches page
  const { chain, isConnected } = useAccount();
  const isChainSupported = useChainIsSupported(chain?.id);

  useEffect(() => {
    if (isConnected && opts.enforceSupportedChains && !isChainSupported) {
      setOpen(true);
      setRoute(routes.SWITCHNETWORKS);
    }
  }, [isConnected, isChainSupported, chain, route, open]);

  // Autoconnect to Family wallet if available
  useEffect(() => {
    if (isFamily()) {
      injectedConnector?.connect();
    }
  }, [injectedConnector]);


  if (!walletConfig?.linkWalletOnSignUp && !walletConfig?.createEmbeddedSigner) {
    throw new Error("Link wallet on sign up is disabled, but no wallet option is enabled. Please enable 'linkWalletOnSignUp' or 'createEmbeddedSigner' in the wallet options.");
  }

  // if (!walletConfig) {
  //   opts.wallet = {
  //     createEmbeddedSigner: true,
  //     embeddedSignerConfiguration: {
  //       shieldPublishableKey: ,
  //       recoveryMethod: RecoveryMethod.AUTOMATIC,
  //       createEncryptedSessionEndpoint: '/api/protected-create-encryption-session',
  //     }
  //   };
  // }

  // const onLogin = () => {
  //   if (opts.wallet?.createEmbeddedSigner) {
  //     setRoute(routes.RECOVER);
  //   }
  // }


  const log = debugMode ? console.log : () => { };

  const value: ContextValue = {
    theme: ckTheme,
    setTheme,
    mode: ckMode,
    setMode,
    customTheme,
    setCustomTheme,
    lang: ckLang,
    setLang,
    open,
    setOpen,
    route,
    setRoute,
    connector,
    setConnector,
    onConnect,
    // Other configuration
    options: opts,
    errorMessage,
    debugMode,
    log,
    displayError: (message: string | React.ReactNode | null, code?: any) => {
      setErrorMessage(message);
      console.log('---------OPENFORT DEBUG---------');
      console.log(message);
      if (code) console.table(code);
      console.log('---------/OPENFORT DEBUG---------');
    },
    resize,
    triggerResize: () => onResize((prev) => prev + 1),
    walletConfig,
  };

  return createElement(
    OpenfortKitContext.Provider,
    { value },
    <>
      <Web3ContextProvider enabled={open}>
        <OpenfortProvider
          baseConfiguration={{
            publishableKey,
          }}
          shieldConfiguration={walletConfig.createEmbeddedSigner ? {
            shieldPublishableKey: walletConfig.embeddedSignerConfiguration.shieldPublishableKey,
            shieldEncryptionKey: walletConfig.embeddedSignerConfiguration.recoveryMethod === RecoveryMethod.PASSWORD ? walletConfig.embeddedSignerConfiguration.shieldEncryptionKey : undefined,
          } : undefined}
          overrides={opts.openfortUrlOverrides}
          debugMode={debugMode}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        >
          <ThemeProvider theme={defaultTheme}>
            {children}
            <ConnectKitModal
              lang={ckLang}
              theme={ckTheme}
              mode={mode}
              customTheme={ckCustomTheme}
            />
          </ThemeProvider>
        </OpenfortProvider>
      </Web3ContextProvider>
    </>
  );
};


