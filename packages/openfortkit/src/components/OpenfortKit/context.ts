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
import { ConnectKitOptionsExtended, FortWalletOptions, OpenfortOptions, routes } from './types';

type Connector = {
  id: string;
  type?: "wallet"
} | {
  id: OAuthProvider;
  type: "oauth";
};
export type ErrorMessage = string | React.ReactNode | null;

export type ContextValue = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  customTheme: CustomTheme | undefined;
  setCustomTheme: React.Dispatch<React.SetStateAction<CustomTheme | undefined>>;
  lang: Languages;
  setLang: React.Dispatch<React.SetStateAction<Languages>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  route: ValueOf<typeof routes>;
  setRoute: React.Dispatch<React.SetStateAction<ValueOf<typeof routes>>>;
  connector: Connector;
  setConnector: React.Dispatch<React.SetStateAction<Connector>>;
  errorMessage: ErrorMessage;
  options?: ConnectKitOptionsExtended;
  debugMode?: boolean;
  log: (...props: any) => void;
  displayError: (message: string | React.ReactNode | null, code?: any) => void;
  resize: number;
  triggerResize: () => void;
  walletConfig: FortWalletOptions;
} & useConnectCallbackProps;

export const OpenfortKitContext = createContext<ContextValue | null>(null);
