import React, { createContext, createElement, useState } from 'react';

export const routes = {
  CONNECT: 'connect',
  KNOWLEDGEBASE: 'knowledgeBase',
  METAMASK: 'metaMask',
  WALLETCONNECT: 'walletConnect',
};

type State = {
  open?: boolean;
  route?: string;
};

type ContextValue = {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
  refresh: any;
};
const familykitRefreshEvent = new Event('familykitrefresh');

const Context = createContext<ContextValue | null>(null);

type Props = {
  children?: React.ReactNode;
};

export const FamilyProvider: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState<State>({
    open: false,
    route: routes.CONNECT, //default route
  });
  const value = {
    state: {
      open: state.open,
      route: state.route,
    },
    setState,
    refresh: () =>
      setTimeout(() => document.dispatchEvent(familykitRefreshEvent), 80),
  };
  return createElement(Context.Provider, { value }, children);
};

export const useContext = () => {
  const context = React.useContext(Context);
  if (!context) throw Error('Family Kit must be inside a Provider.');
  return context;
};
