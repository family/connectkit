import React, {
  createContext,
  createElement,
  useEffect,
  useState,
} from 'react';
import { CustomTheme, Languages, Mode, Theme } from '../types';

import defaultTheme from '../styles/defaultTheme';

import ConnectKitModal from '../components/ConnectModal';
import { ThemeProvider } from 'styled-components';
import { useThemeFont } from '../hooks/useGoogleFont';

export const routes = {
  ONBOARDING: 'onboarding',
  ABOUT: 'about',
  CONNECTORS: 'connectors',
  MOBILECONNECTORS: 'mobileConnectors',
  CONNECT: 'connect',
  DOWNLOAD: 'download',
  PROFILE: 'profile',
  SWITCHNETWORKS: 'switchNetworks',
};

type Connector = any;
type Error = string | React.ReactNode | null;
type ContextValue = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  customTheme: CustomTheme | undefined;
  setCustomTheme: React.Dispatch<React.SetStateAction<CustomTheme | undefined>>;
  lang: Languages;
  setLang: React.Dispatch<React.SetStateAction<Languages>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  connector: string;
  setConnector: React.Dispatch<React.SetStateAction<Connector>>;
  errorMessage: Error;
  options?: ConnectKitOptions;
  debug: (message: string | React.ReactNode | null, code?: any) => void;
};

const Context = createContext<ContextValue | null>(null);

type ConnectKitOptions = {
  language?: Languages;
  hideTooltips?: boolean;
  hideQuestionMarkCTA?: boolean;
  hideNoWalletCTA?: boolean;
  avoidLayoutShift?: boolean; // Avoids layout shift when the ConnectKit modal is open by adding padding to the body
  embedGoogleFonts?: boolean; // Automatically embeds Google Font of the current theme. Does not work with custom themes
  truncateLongENSAddress?: boolean;
  walletConnectName?: string;
  reducedMotion?: boolean;
};

type ConnectKitProviderProps = {
  children?: React.ReactNode;
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme | undefined;
  options?: ConnectKitOptions;
};

export const ConnectKitProvider: React.FC<ConnectKitProviderProps> = ({
  children,
  theme = 'auto',
  mode = 'auto',
  customTheme,
  options,
}) => {
  // Default config options
  const defaultOptions: ConnectKitOptions = {
    language: 'en',
    hideTooltips: false,
    hideQuestionMarkCTA: false,
    hideNoWalletCTA: false,
    avoidLayoutShift: true,
    embedGoogleFonts: false,
    truncateLongENSAddress: true,
    walletConnectName: 'Other Wallets',
    reducedMotion: false,
  };

  const opts: ConnectKitOptions = Object.assign({}, defaultOptions, options);

  const [ckTheme, setTheme] = useState<Theme>(theme);
  const [ckMode, setMode] = useState<Mode>(mode);
  const [ckCustomTheme, setCustomTheme] = useState<CustomTheme | undefined>(
    customTheme ?? {}
  );
  const [ckLang, setLang] = useState<Languages>('en');
  const [open, setOpen] = useState<boolean>(false);
  const [connector, setConnector] = useState<string>('');
  const [route, setRoute] = useState<string>(routes.CONNECTORS);
  const [errorMessage, setErrorMessage] = useState<Error>('');

  // Include Google Font that is needed for a themes
  if (opts.embedGoogleFonts) useThemeFont(theme);

  // Other Configuration
  useEffect(() => setTheme(theme), [theme]);
  useEffect(() => setLang(opts.language || 'en'), [opts.language]);
  useEffect(() => setErrorMessage(null), [route, open]);

  const value = {
    theme: ckTheme,
    setTheme,
    mode: ckMode,
    setMode,
    customTheme,
    setCustomTheme,
    lang: ckLang,
    setLang,
    open,
    setOpen,
    route,
    setRoute,
    connector,
    setConnector,

    // Other configuration
    options: opts,
    errorMessage,
    debug: (message: string | React.ReactNode | null, code?: any) => {
      setErrorMessage(message);

      console.log('---------CONNECTKIT DEBUG---------');
      console.log(message);
      if (code) console.table(code);
      console.log('---------/CONNECTKIT DEBUG---------');
    },
  };

  return createElement(
    Context.Provider,
    { value },
    <>
      <ThemeProvider theme={defaultTheme}>
        {children}
        <ConnectKitModal
          lang={ckLang}
          theme={ckTheme}
          mode={mode}
          customTheme={ckCustomTheme}
        />
      </ThemeProvider>
    </>
  );
};

export const useContext = () => {
  const context = React.useContext(Context);
  if (!context) throw Error('ConnectKit Hook must be inside a Provider.');
  return context;
};

// Experimenal—can change later so only surface in API reference
export const useModal = () => {
  const context = useContext();
  return {
    open: context.open,
    setOpen: context.setOpen,
  };
};
