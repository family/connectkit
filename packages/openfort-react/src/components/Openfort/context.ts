import type { OAuthProvider, SDKOverrides, ThirdPartyAuthConfiguration } from '@openfort/openfort-js'
import type React from 'react'
import { createContext } from 'react'
import type { useConnectCallbackProps } from '../../hooks/useConnectCallback'
import type { CustomTheme, Languages, Mode, Theme } from '../../types'
import type {
  BuyFormState,
  DebugModeOptions,
  OpenfortUIOptionsExtended,
  OpenfortWalletConfig,
  RouteOptions,
  SendFormState,
  SetRouteOptions,
} from './types'

type Connector =
  | {
      id: string
      type?: 'wallet'
    }
  | {
      id: OAuthProvider
      type: 'oauth'
    }
export type ErrorMessage = string | React.ReactNode | null

export type ContextValue = {
  setTheme: React.Dispatch<React.SetStateAction<Theme>>
  mode: Mode
  setMode: React.Dispatch<React.SetStateAction<Mode>>
  setCustomTheme: React.Dispatch<React.SetStateAction<CustomTheme | undefined>>
  lang: Languages
  setLang: React.Dispatch<React.SetStateAction<Languages>>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  route: RouteOptions
  setRoute: (options: SetRouteOptions) => void
  onBack: (() => void) | null
  setOnBack: React.Dispatch<React.SetStateAction<(() => void) | null>>

  previousRoute: RouteOptions | null
  setPreviousRoute: () => void
  routeHistory: RouteOptions[]
  setRouteHistory: React.Dispatch<React.SetStateAction<RouteOptions[]>>
  connector: Connector
  setConnector: React.Dispatch<React.SetStateAction<Connector>>
  errorMessage: ErrorMessage
  debugMode: Required<DebugModeOptions>
  resize: number
  triggerResize: () => void
  uiConfig: OpenfortUIOptionsExtended
  walletConfig?: OpenfortWalletConfig
  overrides?: SDKOverrides
  thirdPartyAuth?: ThirdPartyAuthConfiguration
  emailInput: string
  setEmailInput: React.Dispatch<React.SetStateAction<string>>
  sendForm: SendFormState
  setSendForm: React.Dispatch<React.SetStateAction<SendFormState>>
  buyForm: BuyFormState
  setBuyForm: React.Dispatch<React.SetStateAction<BuyFormState>>
} & useConnectCallbackProps

export const Openfortcontext = createContext<ContextValue | null>(null)
