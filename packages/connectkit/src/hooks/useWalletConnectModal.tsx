import { useState } from 'react';
import { Connector } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
import { useContext } from '../components/ConnectKit';

import { isWalletConnectConnector } from '../utils';
import { useConnect } from './useConnect';

export function useWalletConnectModal() {
  const { log } = useContext();
  const { connectAsync, connectors } = useConnect();
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: async () => {
      // add modal styling because wagmi does not let you add styling to the modal
      const w3mcss = document.createElement('style');
      w3mcss.innerHTML = `w3m-modal, wcm-modal{ --wcm-z-index: 2147483647; --w3m-z-index:2147483647; }`;
      document.head.appendChild(w3mcss);

      const clientConnector: Connector<any, any> | undefined = connectors.find(
        (c) => isWalletConnectConnector(c.id)
      );
      if (clientConnector) {
        let connector: WalletConnectConnector | WalletConnectLegacyConnector;

        if (clientConnector.id === 'walletConnectLegacy') {
          connector = new WalletConnectLegacyConnector({
            ...clientConnector,
            options: {
              ...clientConnector.options,
              qrcode: true,
            },
          });
        } else {
          connector = new WalletConnectConnector({
            ...clientConnector,
            options: {
              ...clientConnector.options,
              showQrModal: true,
            },
          });
        }

        setIsOpen(true);
        try {
          await connectAsync({ connector: connector });
        } catch (err) {
          log('WalletConnect', err);
        }
        setIsOpen(false);

        // remove modal styling
        document.head.removeChild(w3mcss);
      } else {
        log('No WalletConnect connector available');
      }
    },
  };
}
