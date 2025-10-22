import { RecoveryMethod, type SDKOverrides, type ThirdPartyAuthConfiguration } from '@openfort/openfort-js'
import { Buffer } from 'buffer'
import React, { createElement, useEffect, useMemo, useState } from 'react'
import type { ValueOf } from 'viem/_types/types/utils'
import { useAccount, WagmiContext } from 'wagmi'
import { useChainIsSupported } from '../../hooks/useChainIsSupported'
import { useChains } from '../../hooks/useChains'
import type { useConnectCallbackProps } from '../../hooks/useConnectCallback'
import { useConnector } from '../../hooks/useConnectors'
import { useThemeFont } from '../../hooks/useGoogleFont'
import { CoreOpenfortProvider } from '../../openfort/CoreOpenfortProvider'
import type { CustomTheme, Languages, Mode, Theme } from '../../types'
import { logger } from '../../utils/logger'
import { isFamily } from '../../utils/wallets'
import ConnectKitModal from '../ConnectModal'
import { Web3ContextProvider } from '../contexts/web3'
import { type ContextValue, type ErrorMessage, Openfortcontext } from './context'
import {
  type ConnectUIOptions,
  type OpenfortUIOptionsExtended,
  type OpenfortWalletConfig,
  routes,
  UIAuthProvider,
} from './types'

type OpenfortProviderProps = {
  children?: React.ReactNode
  debugMode?: boolean

  publishableKey: string
  uiConfig?: ConnectUIOptions
  walletConfig?: OpenfortWalletConfig
  overrides?: SDKOverrides
  thirdPartyAuth?: ThirdPartyAuthConfiguration
} & useConnectCallbackProps

/**
 * Provides Openfort configuration and context to descendant components.
 *
 * The provider must be rendered within a {@link WagmiContext} and should only be mounted once
 * to avoid conflicting global state. See {@link OpenfortProviderProps} for the supported options.
 *
 * @param props - Provider configuration including callbacks, UI options and the wrapped children.
 * @returns A React element that sets up the Openfort context.
 * @throws If the component is rendered outside of a Wagmi provider or mounted multiple times.
 *
 * @example
 * ```tsx
 * import { WagmiConfig, createConfig } from 'wagmi';
 * import { OpenfortProvider } from '@openfort/openfort-react';
 *
 * const config = createConfig({ YOU_WAGMI_CONFIG_HERE });
 *
 * export function App() {
 *   return (
 *     <WagmiConfig config={config}>
 *       <OpenfortProvider publishableKey={process.env.NEXT_PUBLIC_PUBLISHABLE_KEY!}>
 *         <YourApp />
 *       </OpenfortProvider>
 *     </WagmiConfig>
 *   );
 * }
 * ```
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
    throw Error('OpenfortProvider must be within a WagmiProvider')
  }

  // Only allow for mounting OpenfortProvider once, so we avoid weird global
  // state collisions.
  if (React.useContext(Openfortcontext)) {
    throw new Error('Multiple, nested usages of OpenfortProvider detected. Please use only one.')
  }
  useMemo(() => {
    logger.enabled = !!debugMode
  }, [])

  const chains = useChains()

  const injectedConnector = useConnector('injected')
  const allowAutomaticRecovery = !!(walletConfig?.createEncryptedSessionEndpoint || walletConfig?.getEncryptionSession)

  // Default config options
  const defaultUIOptions: OpenfortUIOptionsExtended = {
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
    walletRecovery: {
      allowedMethods: [RecoveryMethod.PASSWORD, ...(allowAutomaticRecovery ? [RecoveryMethod.AUTOMATIC] : [])],
      defaultMethod: allowAutomaticRecovery ? RecoveryMethod.AUTOMATIC : RecoveryMethod.PASSWORD,
    },
    authProviders: [UIAuthProvider.GUEST, UIAuthProvider.EMAIL, UIAuthProvider.WALLET],
  }

  const safeUiConfig: OpenfortUIOptionsExtended = Object.assign({}, defaultUIOptions, uiConfig)

  if (!safeUiConfig.walletRecovery.allowedMethods) {
    safeUiConfig.walletRecovery.allowedMethods = defaultUIOptions.walletRecovery.allowedMethods
  }
  if (!safeUiConfig.walletRecovery.defaultMethod) {
    safeUiConfig.walletRecovery.defaultMethod = defaultUIOptions.walletRecovery.defaultMethod
  }

  if (safeUiConfig.walletRecovery.allowedMethods.includes(RecoveryMethod.AUTOMATIC) && !allowAutomaticRecovery) {
    safeUiConfig.walletRecovery.allowedMethods = safeUiConfig.walletRecovery.allowedMethods.filter(
      (m) => m !== RecoveryMethod.AUTOMATIC
    )
    logger.warn(
      'Automatic recovery method was removed from allowedMethods because no recovery options are configured in the walletConfig. Please provide either createEncryptedSessionEndpoint or getEncryptionSession to enable automatic recovery.'
    )
  }

  if (typeof window !== 'undefined') {
    // Buffer Polyfill, needed for bundlers that don't provide Node polyfills (e.g CRA, Vite, etc.)
    if (safeUiConfig.bufferPolyfill) window.Buffer = window.Buffer ?? Buffer

    // Some bundlers may need `global` and `process.env` polyfills as well
    // Not implemented here to avoid unexpected behaviors, but leaving example here for future reference
    /*
     * window.global = window.global ?? window;
     * window.process = window.process ?? { env: {} };
     */
  }

  const [ckTheme, setTheme] = useState<Theme>(uiConfig?.theme ?? defaultUIOptions.theme ?? 'auto')
  const [ckMode, setMode] = useState<Mode>(uiConfig?.mode ?? defaultUIOptions.mode ?? 'auto')
  const [ckCustomTheme, setCustomTheme] = useState<CustomTheme | undefined>(uiConfig?.customTheme ?? {})
  const [ckLang, setLang] = useState<Languages>('en-US')
  const [open, setOpen] = useState<boolean>(false)
  const [connector, setConnector] = useState<ContextValue['connector']>({
    id: '',
  })
  const [route, setRoute] = useState<ValueOf<typeof routes>>(routes.LOADING)
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>('')

  const [resize, onResize] = useState<number>(0)
  const [emailInput, setEmailInput] = useState('')

  // Include Google Font that is needed for a themes
  useThemeFont(safeUiConfig.embedGoogleFonts ? ckTheme : ('' as Theme))

  // Other Configuration
  useEffect(() => setTheme(uiConfig?.theme ?? 'auto'), [uiConfig?.theme])
  useEffect(() => setMode(uiConfig?.mode ?? 'auto'), [uiConfig?.mode])
  useEffect(() => setCustomTheme(uiConfig?.customTheme ?? {}), [uiConfig?.customTheme])
  useEffect(() => setLang(safeUiConfig.language || 'en-US'), [safeUiConfig.language])
  useEffect(() => setErrorMessage(null), [route, open])

  // Check if chain is supported, elsewise redirect to switches page
  const { chain, isConnected } = useAccount()
  const isChainSupported = useChainIsSupported(chain?.id)

  useEffect(() => {
    if (isConnected && safeUiConfig.enforceSupportedChains && !isChainSupported) {
      setOpen(true)
      setRoute(routes.SWITCHNETWORKS)
    }
  }, [isConnected, isChainSupported, chain, route, open])

  // Autoconnect to Family wallet if available
  useEffect(() => {
    if (isFamily()) {
      injectedConnector?.connect()
    }
  }, [injectedConnector])

  useEffect(() => {
    logger.log('ROUTE', route)
  }, [route])

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
    uiConfig: safeUiConfig,
    errorMessage,
    debugMode,
    log: logger.log,
    emailInput,
    setEmailInput,
    displayError: (message: string | React.ReactNode | null, code?: any) => {
      setErrorMessage(message)
      logger.log('---------OPENFORT DEBUG---------')
      logger.log(message)
      if (code) logger.log('---------/OPENFORT DEBUG---------')
    },
    resize,
    triggerResize: () => onResize((prev) => prev + 1),
    walletConfig,
    overrides,
    thirdPartyAuth,
  }

  return createElement(
    Openfortcontext.Provider,
    { value },
    <Web3ContextProvider enabled={open}>
      <CoreOpenfortProvider
        baseConfiguration={{
          publishableKey,
        }}
        shieldConfiguration={
          walletConfig
            ? {
                shieldPublishableKey: walletConfig.shieldPublishableKey,
                debug: debugMode,
              }
            : undefined
        }
        overrides={overrides}
        thirdPartyAuth={thirdPartyAuth}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      >
        {/* <ThemeProvider
            theme={defaultTheme}
          > */}
        {children}
        <ConnectKitModal lang={ckLang} theme={ckTheme} mode={uiConfig?.mode ?? ckMode} customTheme={ckCustomTheme} />
        {/* </ThemeProvider> */}
      </CoreOpenfortProvider>
    </Web3ContextProvider>
  )
}
