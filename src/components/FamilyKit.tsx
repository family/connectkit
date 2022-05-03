import React, { createContext, createElement, useState } from 'react';

export const routes = {
  CONNECTORS: 'connectors',
  CONNECT: 'connect',
  ONBOARDING: 'onboarding',
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
  const [connector, setConnector] = useState<string | null>(null);
  const [route, setRoute] = useState<string>(routes.CONNECTORS);
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
