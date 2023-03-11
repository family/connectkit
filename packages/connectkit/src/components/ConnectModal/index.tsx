import { useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { router, routes, useContext } from '../ConnectKit';
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

import { getAppIcon, getAppName } from '../../defaultClient';
import { ConnectKitThemeProvider } from '../ConnectKitThemeProvider/ConnectKitThemeProvider';

const customThemeDefault: object = {};

const ConnectModal: React.FC<{
  mode?: Mode;
  theme?: Theme;
  customTheme?: CustomTheme;
  lang?: Languages;
}> = ({
  mode = 'auto',
  theme = 'auto',
  customTheme = customThemeDefault,
  lang = 'en-US',
}) => {
  const context = useContext();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  //if chain is unsupported we enforce a "switch chain" prompt
  const closeable = !(
    context.options?.enforceSupportedChains && chain?.unsupported
  );

  const showBackButton =
    !chain?.unsupported &&
    router.value !== routes.CONNECTORS &&
    router.value !== routes.PROFILE;

  const showInfoButton =
    !chain?.unsupported && context.route !== routes.PROFILE;

  const onBack = () => {
    if (router.value === routes.SIGNINWITHETHEREUM) {
      router.value = routes.PROFILE;
    } else if (router.value === routes.SWITCHNETWORKS) {
      router.value = routes.PROFILE;
    } else if (router.value === routes.DOWNLOAD) {
      router.value = routes.CONNECT;
    } else {
      router.value = routes.CONNECTORS;
    }
  };

  const pages: any = {
    onboarding: <Onboarding />,
    about: <About />,
    download: <DownloadApp connectorId={context.connector} />,
    connectors: <Connectors />,
    mobileConnectors: <MobileConnectors />,
    connect: <ConnectUsing connectorId={context.connector} />,
    profile: <Profile />,
    switchNetworks: <SwitchNetworks />,
    signInWithEthereum: <SignInWithEthereum />,
  };

  function hide() {
    context.setOpen(false);
  }

  function show() {
    context.setOpen(true);
    router.value = isConnected ? routes.PROFILE : routes.CONNECTORS;
  }

  useEffect(() => {
    if (isConnected) {
      if (
        router.value !== routes.PROFILE ||
        router.value !== routes.SIGNINWITHETHEREUM
      ) {
        if (
          context.signInWithEthereum &&
          !context.options?.disableSiweRedirect
        ) {
          router.value = routes.SIGNINWITHETHEREUM;
        } else {
          hide(); // Hide on connect
        }
      }
    } else {
      hide(); // Hide on connect
    }
  }, [isConnected]);

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
    // TODO:  When pulling data into WalletConnect, figure out which icon gets used and replace with appIcon if available 
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
        onClose={closeable ? hide : undefined}
        onInfo={
          showInfoButton ? () => (router.value = routes.ABOUT) : undefined
        }
        onBack={showBackButton ? onBack : undefined}
      />
    </ConnectKitThemeProvider>
  );
};

export default ConnectModal;
