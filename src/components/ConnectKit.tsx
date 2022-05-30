import React, { createContext, createElement, useState } from 'react';
import { CustomTheme, Languages, Theme } from '../types';

export const routes = {
  CONNECTORS: 'connectors',
  CONNECT: 'connect',
  ONBOARDING: 'onboarding',
  DOWNLOAD: 'download',
  PROFILE: 'profile',
  SWITCHNETWORKS: 'switchnetworks',
};

type Connector = any;

type ContextValue = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  customTheme: CustomTheme;
  setCustomTheme: React.Dispatch<React.SetStateAction<CustomTheme>>;
  lang: Languages;
  setLang: React.Dispatch<React.SetStateAction<Languages>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  connector: string;
  setConnector: React.Dispatch<React.SetStateAction<Connector>>;
  demoMode: boolean;
  setDemoMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const Context = createContext<ContextValue | null>(null);

type Props = {
  children?: React.ReactNode;
};

export const ConnectKitProvider: React.FC<Props> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('auto');
  const [customTheme, setCustomTheme] = useState<CustomTheme>({});
  const [lang, setLang] = useState<Languages>('fr');
  const [open, setOpen] = useState<boolean>(false);
  const [connector, setConnector] = useState<string>('');
  const [route, setRoute] = useState<string>(routes.CONNECTORS);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const value = {
    theme,
    setTheme,
    customTheme,
    setCustomTheme,
    lang,
    setLang,
    open,
    setOpen,
    route,
    setRoute: (route: string) => (!demoMode ? setRoute(route) : null),
    connector,
    setConnector,
    demoMode,
    setDemoMode,
  };
  return createElement(Context.Provider, { value }, children);
};

export const useContext = () => {
  const context = React.useContext(Context);
  if (!context) throw Error('ConnectKit must be inside a Provider.');
  return context;
};
