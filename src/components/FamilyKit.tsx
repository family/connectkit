import React, { createContext, createElement, useState } from 'react';

export const routes = {
  CONNECTORS: 'connectors',
  CONNECT: 'connect',
  ONBOARDING: 'onboarding',
};

export type theme = 'light' | 'dark' | 'auto';
export type languages = 'en' | 'fr';

type Connector = any;

type ContextValue = {
  theme: theme;
  setTheme: React.Dispatch<React.SetStateAction<theme>>;
  lang: languages;
  setLang: React.Dispatch<React.SetStateAction<languages>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  connector: string;
  setConnector: React.Dispatch<React.SetStateAction<Connector>>;
};

const Context = createContext<ContextValue | null>(null);

type Props = {
  children?: React.ReactNode;
};

export const FamilyProvider: React.FC<Props> = ({ children }) => {
  const [theme, setTheme] = useState<theme>('auto');
  const [lang, setLang] = useState<languages>('fr');
  const [open, setOpen] = useState<boolean>(false);
  const [connector, setConnector] = useState<string>('');
  const [route, setRoute] = useState<string>(routes.CONNECTORS);
  const value = {
    theme,
    setTheme,
    lang,
    setLang,
    open,
    setOpen,
    route,
    setRoute,
    connector,
    setConnector,
  };
  return createElement(Context.Provider, { value }, children);
};

export const useContext = () => {
  const context = React.useContext(Context);
  if (!context) throw Error('Family Kit must be inside a Provider.');
  return context;
};
