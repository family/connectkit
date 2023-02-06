import { useConnect } from './useConnect';
import { useWalletConnectConnector } from './connectors/useWalletConnectConnector';
import { useState } from 'react';

export function useWalletConnectModal() {
  const { connectAsync } = useConnect();
  const { connector } = useWalletConnectConnector({
    qrcode: true,
  });
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: async () => {
      //add modal styling because wagmi does not let you add styling to the modal
      const w3mcss = document.createElement('style');
      w3mcss.innerHTML = `w3m-modal{ --w3m-modal-z-index:2147483647; }`;
      document.head.appendChild(w3mcss);

      if (connector) {
        setIsOpen(true);
        try {
          await connectAsync({ connector });
        } catch (err) {
          console.log('WalletConnect', err);
        }
        setIsOpen(false);

        // remove modal styling
        document.head.removeChild(w3mcss);
      } else {
        console.log('No WalletConnect connector available');
      }
    },
  };
}
