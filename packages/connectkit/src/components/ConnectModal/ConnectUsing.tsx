import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useContext } from '../ConnectKit';
import { useWallet } from '../../wallets/useWallets';

import ConnectWithInjector from './ConnectWithInjector';
import ConnectWithQRCode from './ConnectWithQRCode';

import { contentVariants } from '../Common/Modal';
import Alert from '../Common/Alert';

const states = {
  QRCODE: 'qrcode',
  INJECTOR: 'injector',
};

const ConnectUsing = () => {
  const context = useContext();
  const wallet = useWallet(context.connector.id);

  // If cannot be scanned, display injector flow, which if extension is not installed will show CTA to install it
  const isQrCode = !wallet?.isInstalled && wallet?.getWalletConnectDeeplink;

  const [status, setStatus] = useState(
    isQrCode ? states.QRCODE : states.INJECTOR
  );

  useEffect(() => {
    // if no provider, change to qrcode
    const checkProvider = async () => {
      const res = await wallet?.connector.getProvider();
      if (!res) {
        setStatus(states.QRCODE);
        setTimeout(context.triggerResize, 10); // delay required here for modal to resize
      }
    };
    if (status === states.INJECTOR) checkProvider();
  }, []);

  if (!wallet) return <Alert>Connector not found {context.connector.id}</Alert>;

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
            switchConnectMethod={(id?: string) => {
              //if (id) setId(id);
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
            switchConnectMethod={(id?: string) => {
              //if (id) setId(id);
              setStatus(states.QRCODE);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectUsing;
