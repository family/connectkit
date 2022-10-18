import React, { createContext, createElement } from 'react';
import { CustomTheme, Mode, Theme } from './../../types';

type ContextValue = {
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
};

const Context = createContext<ContextValue | null>(null);

type ConnectKitThemeProviderProps = {
  children?: React.ReactNode;
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
};

export const ConnectKitThemeProvider: React.FC<
  ConnectKitThemeProviderProps
> = ({ children, theme = 'auto', mode = 'auto', customTheme }) => {
  const value = {
    theme,
    mode,
    customTheme,
  };

  return createElement(Context.Provider, { value }, <>{children}</>);
};

export const useThemeContext = () => {
  const context = React.useContext(Context);
  if (!context)
    throw Error('ConnectKitThemeProvider must be inside a Provider.');
  return context;
};
