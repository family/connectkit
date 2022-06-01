import { useEffect } from 'react';
import { useConnect } from 'wagmi';
import { routes, useContext } from '../ConnectKit';
import { CustomTheme, Languages, Theme } from '../../types';
import Modal from '../Common/Modal';

import OnboardingIntroduction from '../Pages/Onboarding';
import Connectors from '../Pages/Connectors';
import ConnectUsing from './ConnectUsing';
import DownloadApp from '../Pages/DownloadApp';
import Profile from '../Pages/Profile';
import SwitchNetworks from '../Pages/SwitchNetworks';

const customThemeDefault: object = {};

const ConnectModal: React.FC<{
  theme?: Theme;
  customTheme?: CustomTheme;
  lang?: Languages;
  demoMode?: boolean;
}> = ({
  theme = 'light',
  customTheme = customThemeDefault,
  lang = 'en',
  demoMode = false,
}) => {
  const context = useContext();
  const { isConnected } = useConnect();

  const pages: any = {
    profile: <Profile />,
    download: <DownloadApp connectorId={context.connector} />,
    connectors: <Connectors />,
    onboarding: <OnboardingIntroduction />,
    connect: <ConnectUsing connectorId={context.connector} />,
    switchnetworks: <SwitchNetworks />,
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
  useEffect(() => context.setDemoMode(demoMode), [demoMode]);

  return (
    <Modal
      open={demoMode ? true : context.open}
      pages={pages}
      pageId={context.route}
      onClose={demoMode ? undefined : hide}
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
