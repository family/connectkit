import { Theme } from '@openfort/openfort-kit/build/types';
import React, { createContext, useState, ReactNode } from 'react';

interface SampleContextProps {
  sampleTheme: Theme;
  setSampleTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

export const SampleContext = createContext<SampleContextProps | undefined>(undefined);

interface SampleProviderProps {
  children: ReactNode;
}

export const SampleProvider: React.FC<SampleProviderProps> = ({ children }) => {
  const [sampleTheme, setSampleTheme] = useState<Theme>('midnight');

  return (
    <SampleContext.Provider value={{ sampleTheme, setSampleTheme }}>
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