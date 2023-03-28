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
  options: Types.ConnectKitOptions;
  setOptions: React.Dispatch<React.SetStateAction<Types.ConnectKitOptions>>;
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
  options?: Types.ConnectKitOptions;
};

export const TestBenchProvider: React.FC<TestBenchProviderProps> = ({
  children,
  theme = 'auto',
  customTheme = {},
  mode = 'light',
  options = {
    overlayBlur: 0,
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
    //enforceSupportedChains: false,
    //initialChainId: 0,
  },
}) => {
  const [ckCustomTheme, setCustomTheme] = useState<Types.Theme>(customTheme);
  const [ckTheme, setTheme] = useState<Types.CustomTheme>(theme);
  const [ckMode, setMode] = useState<Types.Mode>(mode);
  const [ckOptions, setOptions] = useState<Types.ConnectKitOptions>(options);
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
