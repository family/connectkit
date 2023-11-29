import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { useContext } from '../ConnectKit';
import { useWallet } from '../../hooks/useWallets';

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
  const wallet = useWallet(context.connector.id, context.connector.name);

  // If cannot be scanned, display injector flow, which if extension is not installed will show CTA to install it
  const useInjector =
    wallet?.connector?.ready && (!wallet?.createUri || wallet?.isInstalled);

  const [status, setStatus] = useState(
    useInjector ? states.INJECTOR : states.QRCODE
  );

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
