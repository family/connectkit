import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useProvider,
} from 'wagmi';
import { routes, useContext } from './../FamilyKit';

import Modal from '../Modal';

import ConnectButton from './../ConnectButton';

import KnowledgeBase from './KnowledgeBase';
import ConnectUsing from './ConnectUsing';
import Connectors from './Connectors';
import ScanQRCode from './ScanQRCode';
import logos from '../../assets/logos';

{
  /**
   * TODO:
   *  Discuss best way to manage pages
   */
}
const pages: any = {
  connect: <Connectors />,
  knowledgeBase: <KnowledgeBase />,
  metaMask: (
    <ConnectUsing
      wallet={{
        name: 'MetaMask',
        logo: logos.MetaMask,
        url: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      }}
    />
  ),
  walletConnect: <ScanQRCode />,
  walletConnectConnecting: (
    <ConnectUsing
      wallet={{
        name: 'WalletConnect',
        logo: logos.WalletConnect,
        url: '',
      }}
    />
  ),
};

const ConnectModal: React.FC<{ theme?: 'light' | 'dark' | 'auto' }> = ({
  theme = 'light',
}) => {
  const context = useContext();
  const {
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
    reset,
    isConnected,
  } = useConnect();
  const { disconnect } = useDisconnect();

  function resetAll() {
    disconnect();
    reset();
  }

  function show() {
    context.setState({ open: true, route: routes.CONNECT });
  }

  function hide() {
    context.setState({ open: false });
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
        open={context.state.open}
        pages={pages}
        pageId={context.state.route}
        onClose={hide}
        onBack={
          context.state.route !== routes.CONNECT
            ? () => context.setState({ open: true, route: routes.CONNECT })
            : undefined
        }
      />
    </>
  );
};

export default ConnectModal;
