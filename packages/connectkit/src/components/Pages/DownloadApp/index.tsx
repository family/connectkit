import React from 'react';

import {
  PageContent,
  ModalBody,
  ModalContent,
} from '../../Common/Modal/styles';

import CustomQRCode from '../../Common/CustomQRCode';

import useLocales from '../../../hooks/useLocales';
import { useWallet } from '../../../wallets/useDefaultWallets';

const DownloadApp: React.FC<{
  walletId: string;
}> = ({ walletId }) => {
  const { wallet } = useWallet(walletId);

  const locales = useLocales({
    CONNECTORNAME: wallet?.name,
  });

  if (!wallet) return <>Wallet {walletId} not found</>;

  const ios = wallet.downloadUrls?.ios;
  const android = wallet.downloadUrls?.android;
  const downloadUri = wallet.downloadUrls?.download;
  const bodycopy =
    ios && android
      ? locales.downloadAppScreen_iosAndroid
      : ios
      ? locales.downloadAppScreen_ios
      : locales.downloadAppScreen_android;

  return (
    <PageContent>
      <ModalContent style={{ paddingBottom: 4, gap: 14 }}>
        {downloadUri && <CustomQRCode value={downloadUri} />}
        {!downloadUri && <>No download link available</>}
        <ModalBody
          style={{ fontSize: 15, lineHeight: '20px', padding: '0 12px' }}
        >
          {bodycopy}
        </ModalBody>
      </ModalContent>
    </PageContent>
  );
};

export default DownloadApp;
