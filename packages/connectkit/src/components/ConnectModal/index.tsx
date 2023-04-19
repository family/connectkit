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

export const useModalRoutes = ({
  onDisconnect,
}: {
  onDisconnect?: () => void;
} = {}) => {
  const context = useContext();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const hide = () => context.setOpen(false);

  //if chain is unsupported we enforce a "switch chain" prompt
  const closeable = !(
    context.options?.enforceSupportedChains && chain?.unsupported
  );

  const wallets = useWallets();
  const oneWallet = wallets.length === 1;
  const walletIsInOtherWallets = (walletId: string) => {
    const i = wallets.map((w) => w.id).indexOf(walletId);
    return i >= 2;
  };

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

  const showInfoButton = context.route !== routes.PROFILE;
  const showBackButton =
    oneWallet && context.route === routes.CONNECT
      ? false
      : context.route !== routes.CONNECTORS && context.route !== routes.PROFILE;

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

  return {
    showBackButton: closeable ? showBackButton : false,
    pages: {
      onboarding: <Onboarding />,
      about: <About />,
      download: <DownloadApp walletId={context.connector} />,
      connectors: <Connectors />,
      otherConnectors: <OtherConnectors />,
      connect: <ConnectUsing walletId={context.connector} />,
      profile: <Profile onDisconnect={onDisconnect} />,
      switchNetworks: <SwitchNetworks />,
      signInWithEthereum: <SignInWithEthereum />,
    },
    onBack: () => {
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
        context.setConnector('');
        // if in the "other wallets" category, back button should go to that connectors page
        context.setRoute(routes.OTHERCONNECTORS);
      } else {
        if (oneWallet) {
          context.setConnector(wallets[0].id);
          context.setRoute(routes.CONNECT);
        } else {
          context.setConnector('');
          context.setRoute(routes.CONNECTORS);
        }
      }
    },
    onClose: () => {
      if (closeable) hide();
    },
    onInfo: () => {
      if (closeable && showInfoButton) {
        context.setRoute(routes.ABOUT);
      }
    },
  };
};

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
  const { pages, onBack, showBackButton, onClose, onInfo } = useModalRoutes();
  const context = useContext();

  useEffect(() => context.setMode(mode), [mode]);
  useEffect(() => context.setTheme(theme), [theme]);
  useEffect(() => context.setCustomTheme(customTheme), [customTheme]);
  useEffect(() => context.setLang(lang), [lang]);

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
        onClose={onClose}
        onInfo={onInfo}
        onBack={showBackButton ? onBack : undefined}
      />
    </ConnectKitThemeProvider>
  );
};

export default ConnectModal;
