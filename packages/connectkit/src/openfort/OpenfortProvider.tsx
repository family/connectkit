import Openfort from '@openfort/openfort-js';
import React, { createContext, createElement, PropsWithChildren, useMemo } from 'react';

type ContextValue = {
  signUpGuest: () => Promise<void>;
};

const Context = createContext<ContextValue | null>(null);

export type OpenfortProviderProps = {

} & ConstructorParameters<typeof Openfort>[0];


export const OpenfortProvider: React.FC<
  PropsWithChildren<OpenfortProviderProps>
> = ({ children, ...openfortProps }) => {
  const openfort = useMemo(() => {
    console.log('Creating Openfort instance with props:', openfortProps);
    return new Openfort(openfortProps)
  }, []);
  console.log("OpenfortProvider openfort", openfortProps);

  const signUpGuest = async () => {
    try {
      console.log('Signing up as guest...', openfort);
      await openfort.signUpGuest();
    } catch (error) {
      console.error('Error logging in as guest:', error);
    }
  };


  const value: ContextValue = {
    signUpGuest
  };

  return createElement(Context.Provider, { value }, <>{children}</>);
};

export const useOpenfort = () => {
  const context = React.useContext(Context);
  if (!context)
    throw Error('useOpenfortContext Hook must be inside OpenfortProvider.');
  return context;
};
