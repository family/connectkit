import { useEffect } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { languages, routes, theme, useContext } from './../FamilyKit';

import Modal from '../Modal';

import ConnectButton from './../ConnectButton';

import OnboardingIntroduction from './Onboarding/Introduction';
import Connectors from './Connectors';
import ConnectUsing from './ConnectUsing';
import Profile from './Profile';

const ConnectModal: React.FC<{ theme?: theme; lang?: languages }> = ({
  theme = 'light',
  lang = 'en',
}) => {
  const context = useContext();
  const { reset, isConnected } = useConnect();
  const { disconnect } = useDisconnect();

  const pages: any = {
    connectors: <Connectors />,
    onboarding: <OnboardingIntroduction />,
    connect: <ConnectUsing connectorId={context.connector} />,
    profile: <Profile />,
  };

  function resetAll() {
    disconnect();
    reset();
  }

  function show() {
    context.setOpen(true);

    if (isConnected) {
      context.setRoute(routes.PROFILE);
    } else {
      context.setRoute(routes.CONNECTORS);
    }
  }

  useEffect(() => {
    if (isConnected) {
      context.setRoute(routes.PROFILE);
    } else {
      context.setRoute(routes.CONNECTORS);
    }
  }, [isConnected]);

  function hide() {
    context.setOpen(false);
  }

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === 'Escape') hide();
    }
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  useEffect(() => context.setTheme(theme), [theme]);
  useEffect(() => context.setLang(lang), [lang]);

  return (
    <>
      <ConnectButton onClick={show} />
      {isConnected && <button onClick={resetAll}>Disconnect Wallet</button>}
      <Modal
        open={context.open}
        pages={pages}
        pageId={context.route}
        onClose={hide}
        onBack={
          context.route !== routes.CONNECTORS &&
          context.route !== routes.PROFILE
            ? () => context.setRoute(routes.CONNECTORS)
            : undefined
        }
      />
    </>
  );
};

export default ConnectModal;
