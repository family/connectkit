import { Buffer } from 'buffer';
import React, {
  createElement,
  useEffect,
  useState
} from 'react';


import { RecoveryMethod, SDKOverrides, ThirdPartyAuthConfiguration } from '@openfort/openfort-js';
import { ValueOf } from 'viem/_types/types/utils';
import { WagmiContext, useAccount } from 'wagmi';
import { useChainIsSupported } from '../../hooks/useChainIsSupported';
import { useChains } from '../../hooks/useChains';
import {
  useConnectCallbackProps
} from '../../hooks/useConnectCallback';
import { useConnector } from '../../hooks/useConnectors';
import { useThemeFont } from '../../hooks/useGoogleFont';
import { CoreOpenfortProvider } from '../../openfort/CoreOpenfortProvider';
import { CustomTheme, Languages, Mode, Theme } from '../../types';
import { isFamily } from '../../utils/wallets';
import ConnectKitModal from '../ConnectModal';
import { Web3ContextProvider } from '../contexts/web3';
import { ContextValue, ErrorMessage, Openfortcontext } from './context';
import { AuthProvider, ConnectUIOptions, OpenfortUIOptionsExtended, OpenfortWalletConfig, routes } from './types';

type OpenfortProviderProps = {
  children?: React.ReactNode;
  debugMode?: boolean;

  publishableKey: string;
  uiConfig?: ConnectUIOptions;
  walletConfig?: OpenfortWalletConfig;
  overrides?: SDKOverrides;
  thirdPartyAuth?: ThirdPartyAuthConfiguration;
} & useConnectCallbackProps;

/**
 * OpenfortProvider component provides context and configuration for Openfort.
 * It must be used within a WagmiProvider.
 *
 * @param {React.ReactNode} children - The child components to be wrapped by the provider.
 * @param {string} [theme='auto'] - The theme to be used, default is 'auto'.
 * @param {string} [mode='auto'] - The mode to be used, default is 'auto'.
 * @param {CustomTheme} [customTheme] - Custom theme configuration.
 * @param {ConnectUIOptions} [options] - Additional configuration options.
 * @param {Function} [onConnect] - Callback function to be called on connect.
 * @param {Function} [onDisconnect] - Callback function to be called on disconnect.
 * @param {boolean} [debugMode=false] - Enable or disable debug mode, default is false.
 * @param {OpenfortOptions} [openfortOptions] - Options for Openfort integration.
 * @throws Will throw an error if used outside of a WagmiProvider or if nested usages are detected.
 */
export const OpenfortProvider = ({
  children,
  uiConfig,
  onConnect,
  onDisconnect,
  debugMode = false,

  publishableKey,
  walletConfig,
  overrides,
  thirdPartyAuth,
}: OpenfortProviderProps) => {
  // OpenfortProvider must be within a WagmiProvider
  if (!React.useContext(WagmiContext)) {
    throw Error('OpenfortProvider must be within a WagmiProvider');
  }

  // Only allow for mounting OpenfortProvider once, so we avoid weird global
  // state collisions.
  if (React.useContext(Openfortcontext)) {
    throw new Error(
      'Multiple, nested usages of OpenfortProvider detected. Please use only one.'
    );
  }


  const chains = useChains();

  const injectedConnector = useConnector('injected');

  // Default config options
  const defaultOptions: OpenfortUIOptionsExtended = {
    theme: 'auto',
    mode: 'auto',
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

  const opts: OpenfortUIOptionsExtended = Object.assign({}, defaultOptions, uiConfig);

  if (!opts.authProviders || opts.authProviders.length === 0) {
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

  const [ckTheme, setTheme] = useState<Theme>(uiConfig?.theme ?? defaultOptions.theme ?? "auto");
  const [ckMode, setMode] = useState<Mode>(uiConfig?.mode ?? defaultOptions.mode ?? 'auto');
  const [ckCustomTheme, setCustomTheme] = useState<CustomTheme | undefined>(
    uiConfig?.customTheme ?? {}
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
  if (opts.embedGoogleFonts) useThemeFont(ckTheme);

  // Other Configuration
  useEffect(() => setTheme(uiConfig?.theme ?? 'auto'), [uiConfig?.theme]);
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

  const log = debugMode ? console.log : () => { };

  useEffect(() => {
    log("ROUTE", route)
  }, [route]);

  const value: ContextValue = {
    setTheme,
    mode: ckMode,
    setMode,
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
    onDisconnect,
    // Other configuration
    uiConfig: opts,
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
    overrides,
    thirdPartyAuth,
  };

  return createElement(
    Openfortcontext.Provider,
    { value },
    <>
      <Web3ContextProvider enabled={open}>
        <CoreOpenfortProvider
          baseConfiguration={{
            publishableKey,
          }}
          shieldConfiguration={walletConfig ? {
            shieldPublishableKey: walletConfig.shieldPublishableKey,
            shieldEncryptionKey: walletConfig.recoveryMethod === RecoveryMethod.PASSWORD ? walletConfig.shieldEncryptionKey : undefined,
            debug: debugMode,
          } : undefined}
          overrides={overrides}
          thirdPartyAuth={thirdPartyAuth}
          debugMode={debugMode}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        >
          {/* <ThemeProvider
            theme={defaultTheme}
          > */}
          {children}
          <ConnectKitModal
            lang={ckLang}
            theme={ckTheme}
            mode={uiConfig?.mode ?? ckMode}
            customTheme={ckCustomTheme}
          />
          {/* </ThemeProvider> */}
        </CoreOpenfortProvider>
      </Web3ContextProvider >
    </>
  );
};


