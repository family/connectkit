import { OpenfortError } from '@openfort/openfort-js';
import { Languages as Lang } from './localizations';
export type Languages = Lang;

export type Theme =
  | 'auto'
  | 'web95'
  | 'retro'
  | 'soft'
  | 'midnight'
  | 'minimal'
  | 'rounded'
  | 'nouns';
export type Mode = 'light' | 'dark' | 'auto';
export type CustomTheme = any; // OLD_TODO: define type

export type All = {
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
  lang?: Languages;
};

export type { ConnectKitOptions as OpenfortKitOptions, OpenfortWalletConfig } from './components/OpenfortKit/types';
export type { CustomAvatarProps } from './components/Common/Avatar';

export enum OpenfortKitErrorType {
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
}

interface Data {
  [key: string]: any;
}
export class OpenfortKitError extends Error {
  type: OpenfortKitErrorType;
  data: Data;
  constructor(message: string, type: OpenfortKitErrorType, data?: Data) {
    if (data?.error instanceof OpenfortKitError) {
      super(data.error.message);
      this.data = data.error.data;
      this.type = data.error.type;
      this.name = data.error.name;
      return;
    } else if (data?.error instanceof Error) {
      super(data.error.message);
    } else {
      super(message);
    }
    this.type = type;
    this.data = data || {};
    this.name = 'OpenfortKitError';
  }
}

export type OpenfortHookOptions<T = { error?: OpenfortKitError }> = {
  onSuccess?: (data: T) => void;
  onError?: (error: OpenfortKitError) => void;
  onSettled?: (data: T | undefined | null, error: OpenfortKitError | null) => void;
  throwOnError?: boolean;
}
