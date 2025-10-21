import type { Languages as Lang } from './localizations'
export type Languages = Lang

export type Theme = 'auto' | 'web95' | 'retro' | 'soft' | 'midnight' | 'minimal' | 'rounded' | 'nouns'
export type Mode = 'light' | 'dark' | 'auto'
export type CustomTheme = any // OLD_TODO: define type

export type All = {
  theme?: Theme
  mode?: Mode
  customTheme?: CustomTheme
  lang?: Languages
}

export type { CustomAvatarProps } from './components/Common/Avatar'
export type { ConnectUIOptions as OpenfortOptions, OpenfortWalletConfig } from './components/Openfort/types'

export enum OpenfortErrorType {
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  WALLET_ERROR = 'WALLET_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

interface Data {
  [key: string]: any
}
export class OpenfortError extends Error {
  type: OpenfortErrorType
  data: Data
  constructor(message: string, type: OpenfortErrorType, data?: Data) {
    if (data?.error instanceof OpenfortError) {
      super(data.error.message)
      this.data = data.error.data
      this.type = data.error.type
      this.name = data.error.name
      return
    } else if (data?.error instanceof Error) {
      super(data.error.message)
    } else {
      super(message)
    }
    this.type = type
    this.data = data || {}
    this.name = 'OpenfortError'
  }
}

export type OpenfortHookOptions<T = { error?: OpenfortError }> = {
  onSuccess?: (data: T) => void
  onError?: (error: OpenfortError) => void
  onSettled?: (data: T | undefined | null, error: OpenfortError | null) => void
  throwOnError?: boolean
}

// Re-export important types and enums from openfort-js
export {
  OAuthProvider,
  SDKOverrides,
  ThirdPartyOAuthProvider,
} from '@openfort/openfort-js'
