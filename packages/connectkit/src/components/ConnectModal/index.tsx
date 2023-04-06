import { useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { routes, useContext } from '../ConnectKit';
import { CustomTheme, Languages, Mode, Theme } from '../../types';
import Modal from '../Common/Modal';

import Onboarding from '../Pages/Onboarding';
import About from '../Pages/About';
import Connectors from '../Pages/Connectors';
import OtherConnectors from '../Pages/OtherConnectors';
import ConnectUsing from './ConnectUsing';
import DownloadApp from '../Pages/DownloadApp';
import Profile from '../Pages/Profile';
import SwitchNetworks from '../Pages/SwitchNetworks';
import SignInWithEthereum from '../Pages/SignInWithEthereum';

import { getAppIcon, getAppName } from '../../defaultClient';
import { ConnectKitThemeProvider } from '../ConnectKitThemeProvider/ConnectKitThemeProvider';
import { useWallets } from '../../wallets/useDefaultWallets';

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

  const wallets = useWallets();
  const walletIsInOtherWallets = (walletId: string) => {
    const i = wallets.map((w) => w.id).indexOf(walletId);
    return i >= 2;
  };

  //if chain is unsupported we enforce a "switch chain" prompt
  const closeable = !(
    context.options?.enforceSupportedChains && chain?.unsupported
  );

  const showBackButton =
    closeable &&
    context.route !== routes.CONNECTORS &&
    context.route !== routes.PROFILE;

  const showInfoButton = closeable && context.route !== routes.PROFILE;

  const onBack = () => {
    if (context.route === routes.SIGNINWITHETHEREUM) {
      context.setRoute(routes.PROFILE);
    } else if (context.route === routes.SWITCHNETWORKS) {
      context.setRoute(routes.PROFILE);
    } else if (context.route === routes.DOWNLOAD) {
      context.setRoute(routes.CONNECT);
    } else if (
      context.route !== routes.OTHERCONNECTORS &&
      walletIsInOtherWallets(context.connector)
    ) {
      // if in the "other wallets" category, back button should go to that connectors page
      context.setRoute(routes.OTHERCONNECTORS);
    } else {
      context.setRoute(routes.CONNECTORS);
    }
  };

  const pages: any = {
    onboarding: <Onboarding />,
    about: <About />,
    download: <DownloadApp walletId={context.connector} />,
    connectors: <Connectors />,
    otherConnectors: <OtherConnectors />,
    connect: <ConnectUsing walletId={context.connector} />,
    profile: <Profile />,
    switchNetworks: <SwitchNetworks />,
    signInWithEthereum: <SignInWithEthereum />,
  };

  function hide() {
    context.setOpen(false);
  }

  useEffect(() => {
    if (isConnected) {
      if (
        context.route !== routes.PROFILE ||
        context.route !== routes.SIGNINWITHETHEREUM
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
        pageId={context.route}
        onClose={closeable ? hide : undefined}
        onInfo={
          showInfoButton ? () => context.setRoute(routes.ABOUT) : undefined
        }
        onBack={showBackButton ? onBack : undefined}
      />
    </ConnectKitThemeProvider>
  );
};

export default ConnectModal;
