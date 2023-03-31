import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import supportedConnectors from './../../constants/supportedConnectors';

import { contentVariants } from '../Common/Modal';

import ConnectWithInjector from './ConnectWithInjector';
import ConnectWithQRCode from './ConnectWithQRCode';

import Alert from '../Common/Alert';
import { useWallet } from '../../wallets/useDefaultWallets';

const states = {
  QRCODE: 'qrcode',
  INJECTOR: 'injector',
};
const ConnectUsing: React.FC<{ walletId: string }> = ({ walletId }) => {
  const [id, setId] = useState<string>(walletId);

  const { wallet } = useWallet(id);

  if (!wallet) return <Alert>Wallet {id} not found</Alert>;

  // If cannot be scanned, display injector flow, which if extension is not installed will show CTA to install it
  const useInjector = !wallet.scannable || wallet.installed;

  const [status, setStatus] = useState(
    useInjector ? states.INJECTOR : states.QRCODE
  );

  return (
    <AnimatePresence>
      {status === states.QRCODE && (
        <motion.div
          key={states.QRCODE}
          initial={'initial'}
          animate={'animate'}
          exit={'exit'}
          variants={contentVariants}
        >
          <ConnectWithQRCode
            walletId={id}
            switchConnectMethod={(id?: string) => {
              if (id) setId(id);
              setStatus(states.INJECTOR);
            }}
          />
        </motion.div>
      )}
      {status === states.INJECTOR && (
        <motion.div
          key={states.INJECTOR}
          initial={'initial'}
          animate={'animate'}
          exit={'exit'}
          variants={contentVariants}
        >
          <ConnectWithInjector
            walletId={id}
            switchConnectMethod={(id?: string) => {
              if (id) setId(id);
              setStatus(states.QRCODE);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectUsing;
