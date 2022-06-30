import { useEffect } from 'react';
import { useConnect } from 'wagmi';
import { routes, useContext } from '../ConnectKit';
import { CustomTheme, Languages, Theme } from '../../types';
import Modal from '../Common/Modal';

import Onboarding from '../Pages/Onboarding';
import About from '../Pages/AboutAlt';
import Connectors from '../Pages/Connectors';
import MobileConnectors from '../Pages/MobileConnectors';
import ConnectUsing from './ConnectUsing';
import DownloadApp from '../Pages/DownloadApp';
import Profile from '../Pages/Profile';
import SwitchNetworks from '../Pages/SwitchNetworks';
import { getAppName } from '../../defaultClient';

const customThemeDefault: object = {};

const ConnectModal: React.FC<{
  theme?: Theme;
  customTheme?: CustomTheme;
  lang?: Languages;
}> = ({ theme = 'light', customTheme = customThemeDefault, lang = 'en' }) => {
  const context = useContext();
  const { isConnected } = useConnect();

  const pages: any = {
    onboarding: <Onboarding />,
    about: <About />,
    download: <DownloadApp connectorId={context.connector} />,
    connectors: <Connectors />,
    mobileConnectors: <MobileConnectors />,
    connect: <ConnectUsing connectorId={context.connector} />,
    profile: <Profile />,
    switchNetworks: <SwitchNetworks />,
  };

  function hide() {
    context.setOpen(false);
  }

  function show() {
    context.setOpen(true);
    context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
  }

  useEffect(() => {
    // Hide on connect
    if (isConnected && context.route !== routes.PROFILE) hide();
  }, [isConnected]);

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

    return () => {
      document.head.removeChild(title);
    };
  }, [context.open]);

  return (
    <Modal
      open={context.open}
      pages={pages}
      pageId={context.route}
      onClose={hide}
      onInfo={
        context.route !== routes.PROFILE
          ? () => context.setRoute(routes.ABOUT)
          : undefined
      }
      onBack={
        context.route !== routes.CONNECTORS && context.route !== routes.PROFILE
          ? () => {
              if (context.route === routes.SWITCHNETWORKS) {
                context.setRoute(routes.PROFILE);
              } else if (context.route === routes.DOWNLOAD) {
                context.setRoute(routes.CONNECT);
              } else {
                context.setRoute(routes.CONNECTORS);
              }
            }
          : undefined
      }
    />
  );
};

export default ConnectModal;
