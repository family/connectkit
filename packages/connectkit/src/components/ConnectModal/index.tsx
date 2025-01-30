import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { routes, useFortKit } from '../FortKit';
import { CustomTheme, Languages, Mode, Theme } from '../../types';
import Modal from '../Common/Modal';

import Onboarding from '../Pages/Onboarding';
import About from '../Pages/About';
import Connectors from '../Pages/Connectors';
import MobileConnectors from '../Pages/MobileConnectors';
import ConnectUsing from './ConnectUsing';
import DownloadApp from '../Pages/DownloadApp';
import Profile from '../Pages/Profile';
import SwitchNetworks from '../Pages/SwitchNetworks';
import SignInWithEthereum from '../Pages/SignInWithEthereum';

import { getAppIcon, getAppName } from '../../defaultConfig';
import { ConnectKitThemeProvider } from '../ConnectKitThemeProvider/ConnectKitThemeProvider';
import { useChainIsSupported } from '../../hooks/useChainIsSupported';
import OpenfortLogin from '../Pages/OpenfortLogin';
import { ValueOf } from 'viem/_types/types/utils';
import SetupEmbeddedSigner from '../Pages/SetRecover';
import Loading from '../Pages/Loading';
import { useOpenfort } from '../../openfort/OpenfortProvider';
import EmailLogin from '../Pages/EmailLogin';
import EmailSignup from '../Pages/EmailSignup';
import { OAuthProvider } from '@openfort/openfort-js';

const customThemeDefault: object = {};

const ConnectModal: React.FC<{
  mode?: Mode;
  theme?: Theme;
  customTheme?: CustomTheme;
  lang?: Languages;
}> = ({ mode = 'auto', theme = 'auto', customTheme = customThemeDefault, lang = 'en-US' }) => {
  const context = useFortKit();
  const { logout } = useOpenfort();
  const { isConnected, chain } = useAccount();
  const chainIsSupported = useChainIsSupported(chain?.id);

  //if chain is unsupported we enforce a "switch chain" prompt
  const closeable = !(
    context.options?.enforceSupportedChains &&
    isConnected &&
    !chainIsSupported
  );

  const mainRoutes: ValueOf<typeof routes>[] = [
    routes.LOGIN,
    routes.PROFILE,
    routes.LOADING,
  ];

  const showBackButton =
    closeable &&
    !mainRoutes.includes(context.route);

  const showInfoButton = closeable && context.route !== routes.PROFILE;

  const onBack = () => {
    // if (context.route === routes.SIGNINWITHETHEREUM) {
    //   context.setRoute(routes.PROFILE);
    // } else if (context.route === routes.SWITCHNETWORKS) {
    //   context.setRoute(routes.PROFILE);
    // } else if (context.route === routes.DOWNLOAD) {
    //   context.setRoute(routes.CONNECT);
    // } else {
    if (context.route === routes.RECOVER) {
      logout();
    }
    context.setRoute(routes.LOGIN);
    // }
  };

  const pages: Record<ValueOf<typeof routes>, React.ReactNode> = {
    onboarding: <Onboarding />,
    about: <About />,
    loading: <Loading />,

    emailLogin: <EmailLogin />,
    emailSignup: <EmailSignup />,

    download: <DownloadApp />,
    connectors: <Connectors />,
    mobileConnectors: <MobileConnectors />,
    login: <OpenfortLogin />,
    connect: <ConnectUsing />,
    profile: <Profile />,
    switchNetworks: <SwitchNetworks />,
    signInWithEthereum: <SignInWithEthereum />,
    recover: <SetupEmbeddedSigner />,

    authProvider: <div>TODO</div>,
  };

  function hide() {
    context.setOpen(false);
  }

  useEffect(() => {
    if (isConnected) {
      if (
        context.route !== routes.PROFILE
        // || context.route !== routes.SIGNINWITHETHEREUM
      ) {
        if (
          context.signInWithEthereum &&
          !context.options?.disableSiweRedirect
        ) {
          context.setRoute(routes.SIGNINWITHETHEREUM);
        } else {
          hide(); // Hide on connect
        }
      }
    } else {
      hide(); // Hide on connect
    }
  }, [isConnected]);

  // if auth redirect
  useEffect(() => {
    const newUrl = new URL(window.location.href);
    const provider = newUrl.searchParams.get("fort_auth_provider");

    context.log("Checking for auth provider", provider);

    function isProvider(value: string | null): value is OAuthProvider {
      if (!value) return false;
      return Object.values(OAuthProvider).includes(value as OAuthProvider);
    }

    if (isProvider(provider)) {
      context.log("Found auth provider", provider);
      context.setOpen(true);
      context.setConnector({ id: provider, type: "oauth" });
      context.setRoute(routes.CONNECT);
    }

  }, [])

  useEffect(() => context.setMode(mode), [mode]);
  useEffect(() => context.setTheme(theme), [theme]);
  useEffect(() => context.setCustomTheme(customTheme), [customTheme]);
  useEffect(() => context.setLang(lang), [lang]);

  /* When pulling data into WalletConnect, it prioritises the og:title tag over the title tag */
  useEffect(() => {
    const appName = getAppName();
    if (!appName || !context.open) return;

    const title = document.createElement('meta');
    title.setAttribute('property', 'og:title');
    title.setAttribute('content', appName);
    document.head.prepend(title);

    /*
    // OLD_TODO:  When pulling data into WalletConnect, figure out which icon gets used and replace with appIcon if available 
    const appIcon = getAppIcon();
    const icon = document.createElement('link');
    if (appIcon) {
      icon.setAttribute('rel', 'icon');
      icon.setAttribute('href', appIcon);
      document.head.prepend(icon);
    }*/

    return () => {
      document.head.removeChild(title);
      //if (appIcon) document.head.removeChild(icon);
    };
  }, [context.open]);

  return (
    <ConnectKitThemeProvider
      theme={theme}
      customTheme={customTheme}
      mode={mode}
    >
      <Modal
        open={context.open}
        pages={pages}
        pageId={context.route}
        onClose={closeable ? hide : undefined}
        // TODO: Implement onInfo
        // onInfo={
        //   showInfoButton ? () => context.setRoute(routes.ONBOARDING) : undefined
        // }
        onBack={showBackButton ? onBack : undefined}
      />
    </ConnectKitThemeProvider>
  );
};

export default ConnectModal;
