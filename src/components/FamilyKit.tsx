import React, { createContext, createElement, useState } from 'react';

export const routes = {
  CONNECT: 'connect',
  ONBOARDING: 'onboarding',
  ONBOARDING_GETWALLET: 'onboardingGetWallet',
  METAMASK: 'metaMask',
  WALLETCONNECT: 'walletConnect',
  COINBASE: 'coinbase',
};

type Connector = any;

type ContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  connector?: any; // TODO: Define type
  setConnector: React.Dispatch<React.SetStateAction<Connector>>;
};

const Context = createContext<ContextValue | null>(null);

type Props = {
  children?: React.ReactNode;
};

export const FamilyProvider: React.FC<Props> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [connector, setConnector] = useState<any>(null);
  const [route, setRoute] = useState<string>(routes.CONNECT);
  const value = {
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
