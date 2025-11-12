import { RecoveryMethod, type SDKOverrides, type ThirdPartyAuthConfiguration } from '@openfort/openfort-js'
import { Buffer } from 'buffer'
import React, { createElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, WagmiContext } from 'wagmi'
import { useChainIsSupported } from '../../hooks/useChainIsSupported'
import type { useConnectCallbackProps } from '../../hooks/useConnectCallback'
import { useConnector } from '../../hooks/useConnectors'
import { useThemeFont } from '../../hooks/useGoogleFont'
import { CoreOpenfortProvider } from '../../openfort/CoreOpenfortProvider'
import type { CustomTheme, Languages, Mode, Theme } from '../../types'
import { logger } from '../../utils/logger'
import { isFamily } from '../../utils/wallets'
import ConnectKitModal from '../ConnectModal'
import { Web3ContextProvider } from '../contexts/web3'
import { type ContextValue, Openfortcontext } from './context'
import {
  type BuyFormState,
  type ConnectUIOptions,
  type DebugModeOptions,
  defaultBuyFormState,
  defaultSendFormState,
  type ErrorMessage,
  notStoredInHistoryRoutes,
  type OpenfortUIOptionsExtended,
  type OpenfortWalletConfig,
  type RouteOptions,
  routes,
  type SendFormState,
  type SetRouteOptions,
  UIAuthProvider,
} from './types'

// TODO: debug. this could be useful
// function stringifyWithDepth(obj, depth = 3) {
//   const seen = new WeakSet()

//   function helper(value, currentDepth) {
//     if (value === null || typeof value !== 'object') {
//       return value
//     }

//     if (seen.has(value)) {
//       return '[Circular]'
//     }

//     seen.add(value)

//     if (currentDepth >= depth) {
//       return '[Object]'
//     }

//     if (Array.isArray(value)) {
//       return value.map((v) => helper(v, currentDepth + 1))
//     }

//     const result = {}
//     for (const key in value) {
//       result[key] = helper(value[key], currentDepth + 1)
//     }
//     return result
//   }

//   return JSON.stringify(helper(obj, 0), null, 2)
// }

type OpenfortProviderProps = {
  children?: React.ReactNode
  debugMode?: boolean | DebugModeOptions

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
  debugMode,

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

  const debugModeOptions: Required<DebugModeOptions> = useMemo(() => {
    const getDebugMode = () => {
      if (typeof debugMode === 'undefined') {
        return {
          shieldDebugMode: false,
          openfortCoreDebugMode: false,
          openfortReactDebugMode: false,
        }
      } else if (typeof debugMode === 'boolean') {
        return {
          shieldDebugMode: debugMode,
          openfortCoreDebugMode: debugMode,
          openfortReactDebugMode: debugMode,
        }
      } else {
        return {
          shieldDebugMode: debugMode.shieldDebugMode ?? false,
          openfortCoreDebugMode: debugMode.openfortCoreDebugMode ?? false,
          openfortReactDebugMode: debugMode.openfortReactDebugMode ?? false,
        }
      }
    }
    const debugModeOptions = getDebugMode()
    logger.enabled = debugModeOptions.openfortReactDebugMode
    return debugModeOptions
  }, [debugMode])

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
    enforceSupportedChains: false,
    ethereumOnboardingUrl: undefined,
    walletOnboardingUrl: undefined,
    buyWithCardUrl: undefined,
    buyFromExchangeUrl: undefined,
    buyTroubleshootingUrl: undefined,
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

  const [ckTheme, setTheme] = useState<Theme>(safeUiConfig.theme ?? 'auto')
  const [ckMode, setMode] = useState<Mode>(safeUiConfig.mode ?? 'auto')
  const [ckCustomTheme, setCustomTheme] = useState<CustomTheme | undefined>(safeUiConfig.customTheme ?? {})
  const [ckLang, setLang] = useState<Languages>('en-US')
  const [open, setOpenWithoutHistory] = useState<boolean>(false)
  const [connector, setConnector] = useState<ContextValue['connector']>({
    id: '',
  })
  const [route, setRoute] = useState<RouteOptions>({ route: routes.LOADING })
  const [routeHistory, setRouteHistory] = useState<RouteOptions[]>([])

  const [errorMessage, setErrorMessage] = useState<ErrorMessage>('')

  const [resize, onResize] = useState<number>(0)
  const [emailInput, setEmailInput] = useState('')
  const [sendForm, setSendForm] = useState<SendFormState>(defaultSendFormState)
  const [buyForm, setBuyForm] = useState<BuyFormState>(defaultBuyFormState)
  const [headerLeftSlot, setHeaderLeftSlot] = useState<React.ReactNode | null>(null)

  const setOpen = (value: boolean) => {
    if (value) {
      setRouteHistory([])
    }
    setOpenWithoutHistory(value)
  }

  // Include Google Font that is needed for a themes
  useThemeFont(safeUiConfig.embedGoogleFonts ? ckTheme : ('' as Theme))

  // Other Configuration
  useEffect(() => setTheme(safeUiConfig.theme ?? 'auto'), [safeUiConfig.theme])
  useEffect(() => setMode(safeUiConfig.mode ?? 'auto'), [safeUiConfig.mode])
  useEffect(() => setCustomTheme(safeUiConfig.customTheme ?? {}), [safeUiConfig.customTheme])
  useEffect(() => setLang(safeUiConfig.language || 'en-US'), [safeUiConfig.language])
  useEffect(() => setErrorMessage(null), [route, open])

  // Check if chain is supported, elsewise redirect to switches page
  const { chain, isConnected } = useAccount()
  const isChainSupported = useChainIsSupported(chain?.id)

  useEffect(() => {
    if (isConnected && safeUiConfig.enforceSupportedChains && !isChainSupported) {
      setOpen(true)
      setRoute({ route: routes.SWITCHNETWORKS })
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

  useEffect(() => {
    setHeaderLeftSlot(null)
  }, [route.route])

  const typedSetRoute = useCallback(
    (options: SetRouteOptions) => {
      const routeObj = typeof options === 'string' ? { route: options } : options
      const { route } = routeObj
      const lastRoute = routeHistory.length > 0 ? routeHistory[routeHistory.length - 1] : null

      setRoute(routeObj)

      if (lastRoute && lastRoute.route === route) return
      if (!notStoredInHistoryRoutes.includes(route)) {
        setRouteHistory((prev) => [...prev, routeObj])
      }
    },
    [routeHistory]
  )

  const setPreviousRoute = useCallback(() => {
    setRouteHistory((prev) => {
      const newHistory = [...prev]
      newHistory.pop()
      if (newHistory.length > 0) {
        setRoute(newHistory[newHistory.length - 1])
      } else {
        setRoute({ route: routes.PROFILE })
      }
      return newHistory
    })
  }, [])

  const triggerResize = useCallback(() => {
    onResize((prev) => prev + 1)
  }, [])

  const [onBack, setOnBack] = useState<(() => void) | null>(null)

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
    setRoute: typedSetRoute,
    onBack,
    setOnBack,
    setPreviousRoute,
    routeHistory,
    setRouteHistory,
    previousRoute: routeHistory.length > 1 ? routeHistory[routeHistory.length - 2] : null,
    connector,
    setConnector,
    onConnect,
    onDisconnect,
    // Other configuration
    uiConfig: safeUiConfig,
    errorMessage,
    debugMode: debugModeOptions,
    emailInput,
    setEmailInput,
    resize,
    triggerResize,
    publishableKey,
    walletConfig,
    overrides,
    thirdPartyAuth,
    sendForm,
    setSendForm,
    buyForm,
    setBuyForm,
    headerLeftSlot,
    setHeaderLeftSlot,
  }

  return createElement(
    Openfortcontext.Provider,
    { value },
    <Web3ContextProvider>
      <CoreOpenfortProvider
        openfortConfig={{
          baseConfiguration: {
            publishableKey,
          },
          shieldConfiguration: walletConfig
            ? {
                shieldPublishableKey: walletConfig.shieldPublishableKey,
                debug: debugModeOptions.shieldDebugMode,
              }
            : undefined,
          debug: debugModeOptions.openfortCoreDebugMode,
          overrides,
          thirdPartyAuth,
        }}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      >
        {/* <ThemeProvider
            theme={defaultTheme}
          > */}
        {children}
        <ConnectKitModal lang={ckLang} theme={ckTheme} mode={safeUiConfig.mode ?? ckMode} customTheme={ckCustomTheme} />
        {/* </ThemeProvider> */}
        {/* TODO: Debug */}
        {/* <div style={{ position: 'absolute', height: 0, width: 0, top: 0, zIndex: 50 }}>
          <pre>
            {stringifyWithDepth({
              routeHistory,
            })}
          </pre>
        </div> */}
      </CoreOpenfortProvider>
    </Web3ContextProvider>
  )
}
