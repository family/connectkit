import { AuthProvider, RecoveryMethod } from "@openfort/react";
import { Theme } from "@openfort/react";
import React, { createContext, useState, ReactNode } from 'react';

interface SampleContextProps {
  sampleTheme: Theme;
  setSampleTheme: React.Dispatch<React.SetStateAction<Theme>>;
  sampleProviders: AuthProvider[];
  setSampleProviders: React.Dispatch<React.SetStateAction<AuthProvider[]>>;
  recoveryMethod: RecoveryMethod;
  setRecoveryMethod: React.Dispatch<React.SetStateAction<RecoveryMethod>>;
}

export const SampleContext = createContext<SampleContextProps | undefined>(undefined);

interface SampleProviderProps {
  children: ReactNode;
}

export const SampleProvider: React.FC<SampleProviderProps> = ({ children }) => {
  const [sampleTheme, setSampleTheme] = useState<Theme>('midnight');
  const [sampleProviders, setSampleProviders] = useState<AuthProvider[]>([
    AuthProvider.GUEST,
    AuthProvider.EMAIL,
    AuthProvider.GOOGLE,
    AuthProvider.WALLET,
    // AuthProvider.TWITTER,
    // AuthProvider.FACEBOOK,
  ]);
  const [recoveryMethod, setRecoveryMethod] = useState<RecoveryMethod>(RecoveryMethod.PASSWORD);

  return (
    <SampleContext.Provider value={{ sampleTheme, setSampleTheme, sampleProviders, setSampleProviders, recoveryMethod, setRecoveryMethod }}>
      {children}
    </SampleContext.Provider>
  );
};

export const useSample = () => {
  const context = React.useContext(SampleContext);
  if (context === undefined) {
    throw new Error('useSample must be used within a SampleProvider');
  }
  return context;
};