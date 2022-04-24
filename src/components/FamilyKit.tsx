import React, { createContext, createElement, useState } from 'react';

type State = {
  open?: boolean;
};

type ContextValue = {
  state: {
    open?: boolean;
  };
  setState: React.Dispatch<React.SetStateAction<State>>;
};

const Context = createContext<ContextValue | null>(null);

type Props = {
  children?: React.ReactNode;
};

export const FamilyProvider: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState<State>({
    open: false,
  });
  const value = {
    state: {
      open: state.open,
    },
    setState,
  };
  return createElement(Context.Provider, { value }, children);
};

export const useContext = () => {
  const context = React.useContext(Context);
  if (!context) throw Error('Family Kit must be inside a Provider.');
  return context;
};
