import { useEffect } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { routes, useContext } from './../FamilyKit';

import Modal from '../Modal';

import ConnectButton from './../ConnectButton';

import OnboardingIntroduction from './Onboarding/Introduction';
import OnboardingGetWallet from './Onboarding/GetWallet';
import ConnectUsing from './ConnectUsing';
import Connectors from './Connectors';

{
  /**
   * TODO:
   *  Discuss best way to manage pages
   */
}
const pages: any = {
  connect: <Connectors />,
  onboarding: <OnboardingIntroduction />,
  onboardingGetWallet: <OnboardingGetWallet />,
  metaMask: <ConnectUsing connectorId={'injected'} />,
  walletConnect: <ConnectUsing connectorId={'walletConnect'} />,
  coinbase: <ConnectUsing connectorId={'coinbaseWallet'} />,
};

const ConnectModal: React.FC<{ theme?: 'light' | 'dark' | 'auto' }> = ({
  theme = 'light',
}) => {
  const context = useContext();
  const { reset, isConnected } = useConnect();
  const { disconnect } = useDisconnect();

  function resetAll() {
    disconnect();
    reset();
  }

  function show() {
    context.setOpen(true);
    context.setRoute(routes.CONNECT);
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

  return (
    <>
      <ConnectButton onClick={show} theme={theme} />
      {isConnected && <button onClick={resetAll}>Disconnect Wallet</button>}
      <Modal
        theme={theme}
        open={context.open}
        pages={pages}
        pageId={context.route}
        onClose={hide}
        onBack={
          // TODO: Track history so back button goes to correct route
          context.route !== routes.CONNECT
            ? () => context.setRoute(routes.CONNECT)
            : undefined
        }
      />
    </>
  );
};

export default ConnectModal;
