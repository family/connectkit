import React, {
  createContext
} from 'react';
import {
  CustomTheme,
  Languages,
  Mode,
  Theme
} from '../../types';


import { OAuthProvider } from '@openfort/openfort-js';
import { ValueOf } from 'viem/_types/types/utils';
import {
  useConnectCallbackProps
} from '../../hooks/useConnectCallback';
import { ConnectKitOptionsExtended, OpenfortWalletConfig, routes } from './types';

type Connector = {
  id: string;
  type?: "wallet"
} | {
  id: OAuthProvider;
  type: "oauth";
};
export type ErrorMessage = string | React.ReactNode | null;

export type ContextValue = {
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
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
  debugMode?: boolean;
  log: (...props: any) => void;
  displayError: (message: string | React.ReactNode | null, code?: any) => void;
  resize: number;
  triggerResize: () => void;
  uiConfig?: ConnectKitOptionsExtended;
  walletConfig?: OpenfortWalletConfig;
} & useConnectCallbackProps;

export const OpenfortKitContext = createContext<ContextValue | null>(null);
