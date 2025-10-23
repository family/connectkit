import type { OAuthProvider, SDKOverrides, ThirdPartyAuthConfiguration } from '@openfort/openfort-js'
import type React from 'react'
import { createContext } from 'react'
import type { ValueOf } from 'viem/_types/types/utils'
import type { useConnectCallbackProps } from '../../hooks/useConnectCallback'
import type { CustomTheme, Languages, Mode, Theme } from '../../types'
import type { OpenfortUIOptionsExtended, OpenfortWalletConfig, routes } from './types'

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
  route: ValueOf<typeof routes>
  setRoute: (r: ValueOf<typeof routes>) => void
  connector: Connector
  setConnector: React.Dispatch<React.SetStateAction<Connector>>
  errorMessage: ErrorMessage
  debugMode?: boolean
  resize: number
  triggerResize: () => void
  uiConfig: OpenfortUIOptionsExtended
  walletConfig?: OpenfortWalletConfig
  overrides?: SDKOverrides
  thirdPartyAuth?: ThirdPartyAuthConfiguration
  emailInput: string
  setEmailInput: React.Dispatch<React.SetStateAction<string>>
} & useConnectCallbackProps

export const Openfortcontext = createContext<ContextValue | null>(null)
