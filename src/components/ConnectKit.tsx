import React, {
  createContext,
  createElement,
  useEffect,
  useState,
} from 'react';
import { CustomTheme, Languages, Theme } from '../types';

import ConnectKitModal from '../components/ConnectModal';

export const routes = {
  CONNECTORS: 'connectors',
  CONNECT: 'connect',
  ONBOARDING: 'onboarding',
  DOWNLOAD: 'download',
  PROFILE: 'profile',
  SWITCHNETWORKS: 'switchnetworks',
};

type Connector = any;

type ContextValue = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  customTheme: CustomTheme;
  setCustomTheme: React.Dispatch<React.SetStateAction<CustomTheme>>;
  lang: Languages;
  setLang: React.Dispatch<React.SetStateAction<Languages>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  connector: string;
  setConnector: React.Dispatch<React.SetStateAction<Connector>>;
};

const Context = createContext<ContextValue | null>(null);

type ConnectKitProviderProps = {
  children?: React.ReactNode;
  theme?: Theme;
  language?: Languages;
  customTheme?: CustomTheme;
};
export const ConnectKitProvider: React.FC<ConnectKitProviderProps> = ({
  children,
  theme = 'auto',
  language = 'en',
  customTheme,
}) => {
  const [ckTheme, setTheme] = useState<Theme>(theme);
  const [ckCustomTheme, setCustomTheme] = useState<CustomTheme>({});
  const [ckLang, setLang] = useState<Languages>(language);
  const [open, setOpen] = useState<boolean>(false);
  const [connector, setConnector] = useState<string>('');
  const [route, setRoute] = useState<string>(routes.CONNECTORS);

  useEffect(() => setTheme(theme), [theme]);
  useEffect(() => setLang(language), [language]);

  const value = {
    theme: ckTheme,
    setTheme,
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
  };
  return createElement(
    Context.Provider,
    { value },
    <>
      {children}
      <ConnectKitModal lang={ckLang} theme={ckTheme} />
    </>
  );
};

export const useContext = () => {
  const context = React.useContext(Context);
  if (!context) throw Error('ConnectKit must be inside a Provider.');
  return context;
};
