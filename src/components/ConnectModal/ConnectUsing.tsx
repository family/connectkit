import React, { useState } from 'react';

import supportedConnectors from './../../constants/supportedConnectors';
import ConnectWithInjector from './ConnectWithInjector';
import ConnectWithQRCode from './ConnectWithQRCode';

const states = {
  QRCODE: 'qrcode',
  INJECTOR: 'injector',
};
const ConnectUsing: React.FC<{ connectorId: string }> = ({ connectorId }) => {
  const [id, setId] = useState<string>(connectorId);

  const connector = supportedConnectors.filter((c) => c.id === id)[0];

  const hasExtensionInstalled =
    connector.extensionIsInstalled && connector.extensionIsInstalled();

  // If cannot be scanned, display injector flow, which if extension is not installed will show CTA to install it
  const useInjector = !connector.scannable || hasExtensionInstalled;

  const [status, setStatus] = useState(
    useInjector ? states.INJECTOR : states.QRCODE
  );

  if (!connector) return <>Connector not found</>;
  return (
    <>
      {status === states.QRCODE && (
        <ConnectWithQRCode
          connectorId={id}
          switchConnectMethod={(id?: string) => {
            if (id) setId(id);
            setStatus(states.INJECTOR);
          }}
        />
      )}
      {status === states.INJECTOR && (
        <ConnectWithInjector
          connectorId={id}
          switchConnectMethod={(id?: string) => {
            if (id) setId(id);
            setStatus(states.QRCODE);
          }}
        />
      )}
    </>
  );
};

export default ConnectUsing;
