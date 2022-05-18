import { useEffect } from 'react';
import { useConnect } from 'wagmi';
import { routes, useContext, Theme, Languages } from './../FamilyKit';

import Modal from '../common/Modal';

import OnboardingIntroduction from '../pages/Onboarding';
import Connectors from '../pages/Connectors';
import ConnectUsing from './ConnectUsing';
import DownloadApp from './DownloadApp';
import Profile from '../pages/Profile';

const ConnectModal: React.FC<{
  theme?: Theme;
  lang?: Languages;
}> = ({ theme = 'light', lang = 'en' }) => {
  const context = useContext();
  const { isConnected } = useConnect();

  const pages: any = {
    profile: <Profile />,
    download: <DownloadApp connectorId={context.connector} />,
    connectors: <Connectors />,
    onboarding: <OnboardingIntroduction />,
    connect: <ConnectUsing connectorId={context.connector} />,
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
  useEffect(() => context.setLang(lang), [lang]);

  return (
    <>
      <Modal
        open={context.open}
        pages={pages}
        pageId={context.route}
        onClose={hide}
        onBack={
          context.route !== routes.CONNECTORS &&
          context.route !== routes.PROFILE
            ? () => {
                if (context.route === routes.DOWNLOAD) {
                  context.setRoute(routes.CONNECT);
                } else {
                  context.setRoute(routes.CONNECTORS);
                }
              }
            : undefined
        }
      />
    </>
  );
};

export default ConnectModal;
