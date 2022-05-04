import { useEffect } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { routes, useContext } from './../FamilyKit';

import Modal from '../Modal';

import ConnectButton from './../ConnectButton';

import OnboardingIntroduction from './Onboarding/Introduction';
import Connectors from './Connectors';
import ConnectUsing from './ConnectUsing';
//import ConnectWithInjector from './ConnectWithInjector';
//import ConnectWithQRCode from './ConnectWithQRCode';

const ConnectModal: React.FC<{ theme?: 'light' | 'dark' | 'auto' }> = ({
  theme = 'light',
}) => {
  const context = useContext();
  const { reset, isConnected } = useConnect();
  const { disconnect } = useDisconnect();

  const pages: any = {
    connectors: <Connectors />,
    onboarding: <OnboardingIntroduction />,
    connect: <ConnectUsing connectorId={context.connector} />,
  };

  function resetAll() {
    disconnect();
    reset();
  }

  function show() {
    context.setOpen(true);
    context.setRoute(routes.CONNECTORS);
  }

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

  useEffect(() => {
    if (isConnected) hide();
  }, [isConnected]);

  useEffect(() => context.setTheme(theme), [theme]);

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
          // TODO: Track history so back button goes to correct route
          context.route !== routes.CONNECTORS
            ? () => context.setRoute(routes.CONNECTORS)
            : undefined
        }
      />
    </>
  );
};

export default ConnectModal;
