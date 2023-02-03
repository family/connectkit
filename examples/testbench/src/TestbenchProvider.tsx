import React, {
  createContext,
  createElement,
  useEffect,
  useState,
} from 'react';
import { Types } from 'connectkit';

type ContextValue = {
  theme: Types.Theme;
  setTheme: React.Dispatch<React.SetStateAction<Types.Theme>>;
  customTheme: Types.CustomTheme;
  setCustomTheme: React.Dispatch<React.SetStateAction<Types.CustomTheme>>;
  mode: Types.Mode;
  setMode: React.Dispatch<React.SetStateAction<Types.Mode>>;
  options: any;
  setOptions: React.Dispatch<React.SetStateAction<any>>;
  hideBalance: boolean;
  setHideBalance: React.Dispatch<React.SetStateAction<boolean>>;
  hideAvatar: boolean;
  setHideAvatar: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  setLabel: React.Dispatch<React.SetStateAction<string>>;
};

const Context = createContext<ContextValue | null>(null);

type TestBenchProviderProps = {
  children?: React.ReactNode;
  theme?: Types.Theme;
  customTheme?: Types.CustomTheme;
  mode?: Types.Mode;
  options?: any;
};

export const TestBenchProvider: React.FC<TestBenchProviderProps> = ({
  children,
  theme = 'auto',
  customTheme = {},
  mode = 'light',
  options = {
    language: 'en-US',
    hideTooltips: false,
    hideQuestionMarkCTA: false,
    hideNoWalletCTA: false,
    avoidLayoutShift: true,
    embedGoogleFonts: true,
    truncateLongENSAddress: true,
    reducedMotion: false,
    disclaimer: null,
    bufferPolyfill: true,
    walletConnectCTA: 'link',
    //initialChainId: 0,
  },
}) => {
  const [ckCustomTheme, setCustomTheme] = useState<Types.Theme>(customTheme);
  const [ckTheme, setTheme] = useState<Types.CustomTheme>(theme);
  const [ckMode, setMode] = useState<Types.Mode>(mode);
  const [ckOptions, setOptions] = useState<any>(options);
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [hideAvatar, setHideAvatar] = useState<boolean>(false);
  const [label, setLabel] = useState<string | undefined>();

  useEffect(() => setTheme(theme), [theme]);

  const value: any = {
    theme: ckTheme,
    setTheme,
    customTheme: ckCustomTheme,
    setCustomTheme,
    mode: ckMode,
    setMode,
    options: ckOptions,
    setOptions,
    hideBalance,
    setHideBalance,
    hideAvatar,
    setHideAvatar,
    label,
    setLabel,
  };

  return createElement(Context.Provider, { value }, <>{children}</>);
};

export const useTestBench = () => {
  const context = React.useContext(Context);
  if (!context) throw Error('TestBenchProvider must be inside a Provider.');
  return context;
};
