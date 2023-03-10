import React, { useState } from 'react';
import supportedConnectors from '../../../constants/supportedConnectors';

import {
  PageContent,
  ModalBody,
  ModalContent,
} from '../../Common/Modal/styles';
import { OrDivider } from '../../Common/Modal';

import CustomQRCode from '../../Common/CustomQRCode';
import Button from '../../Common/Button';

import { ExternalLinkIcon } from '../../../assets/icons';
import useLocales from '../../../hooks/useLocales';

const DownloadApp: React.FC<{
  connectorId: string;
}> = ({ connectorId }) => {
  const [id] = useState(connectorId);
  const connector = supportedConnectors.filter((c) => c.id === id)[0];

  const locales = useLocales({
    CONNECTORNAME: connector.name,
  });

  if (!connector) return <>Connector not found</>;

  const ios = connector.appUrls?.ios;
  const android = connector.appUrls?.android;
  const downloadUri = connector.appUrls?.download;
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
        {connector.defaultConnect && <OrDivider />}
      </ModalContent>

      {connector.defaultConnect && ( // Open the default connector modal
        <Button icon={<ExternalLinkIcon />}>Open Default Modal</Button>
      )}
    </PageContent>
  );
};

export default DownloadApp;
