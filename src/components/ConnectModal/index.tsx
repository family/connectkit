import { useEffect } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { routes, useContext } from './../FamilyKit';

import logos from '../../assets/logos';

import Modal from '../Modal';

import ConnectButton from './../ConnectButton';

import OnboardingIntroduction from './Onboarding/Introduction';
import OnboardingGetWallet from './Onboarding/GetWallet';
import ConnectUsing from './ConnectUsing';
import Connectors from './Connectors';
import ScanQRCode from './ScanQRCode';

const { ethereum } = window;
const isMetaMask = () => Boolean(ethereum && ethereum.isMetaMask);
const isCoinbaseWallet = () => Boolean(ethereum && ethereum.isCoinbaseWallet);

/**
 * This is more likely not how we will be doing this, just set up for prototyping
 */
const supportedWallets = {
  metaMask: {
    name: 'MetaMask',
    logo: logos.MetaMask,
    extensionUrl:
      'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    extensionCheck: () => {
      return isMetaMask();
    },
    extensionLaunch: async () => {
      if (!ethereum) return false;
      if (!isMetaMask()) return false;
      try {
        return await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        return error;
      }
    },
  },
  walletConnect: {
    name: 'WalletConnect',
    logo: logos.WalletConnect,
    extensionUrl: false,
    extensionCheck: () => {
      return false;
    },
  },
  coinbase: {
    name: 'Coinbase',
    logo: logos.Coinbase,
    extensionUrl: 'https://api.wallet.coinbase.com/rpc/v2/desktop/chrome',
    extensionCheck: () => {
      return isCoinbaseWallet();
    },
  },
};

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
  metaMask: <ConnectUsing wallet={supportedWallets.metaMask} />,
  walletConnect: <ScanQRCode />,
  walletConnectConnecting: <ScanQRCode />,
  coinbase: <ConnectUsing wallet={supportedWallets.coinbase} />,
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
