import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import CustomQRCode from '../CustomQRCode';
import Button from '../Button';
import { useConnect } from 'wagmi';
import { Listener } from '@ethersproject/abstract-provider';
import { OrDivider } from '../Modal';
import {
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeading,
} from '../Modal/styles';
import { detectBrowser } from '../../utils';
import BrowserIcon from '../BrowserIcon';

import supportedConnectors from '../../constants/supportedConnectors';
import TestBench from '../TestBench';
import Tooltip from '../Tooltip';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;

const AlertIcon = ({ ...props }) => {
  return (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" {...props}>
      <path
        d="M2.20779 17H15.7922C17.1342 17 18 15.9796 18 14.7286C18 14.356 17.9134 13.9744 17.7143 13.6195L10.9091 1.14457C10.4935 0.381524 9.74892 0 9.00433 0C8.25974 0 7.49784 0.381524 7.09091 1.14457L0.294372 13.6284C0.0952381 13.9744 0 14.356 0 14.7286C0 15.9796 0.865801 17 2.20779 17ZM9.00433 10.8601C8.49351 10.8601 8.20779 10.5673 8.19048 10.035L8.06061 5.96242C8.04329 5.42119 8.4329 5.03079 8.99567 5.03079C9.54978 5.03079 9.95671 5.43006 9.93939 5.97129L9.80952 10.0261C9.78355 10.5673 9.49784 10.8601 9.00433 10.8601ZM9.00433 14.1874C8.42424 14.1874 7.94805 13.7704 7.94805 13.1759C7.94805 12.5814 8.42424 12.1644 9.00433 12.1644C9.58442 12.1644 10.0606 12.5725 10.0606 13.1759C10.0606 13.7792 9.57576 14.1874 9.00433 14.1874Z"
        fill="var(--body-color-danger)"
      />
    </svg>
  );
};

const ConnectWithQRCode: React.FC<{
  connectorId: string;
  switchConnectMethod: (id?: string) => void;
}> = ({ connectorId, switchConnectMethod }) => {
  const [id, setId] = useState(connectorId);
  const connector = supportedConnectors.filter((c) => c.id === id)[0];
  console.log(connector, id);

  const { connectors } = useConnect();
  const [connectorUri, setConnectorUri] = useState<string | null>(null);

  const handleQRCode: Listener = (err, payload) => {
    if (err) console.log(err);
    const uri = payload.params[0];
    setConnectorUri(uri);
  };

  const startConnect = async () => {
    const c = connectors.filter((c) => c.id === id)[0];
    if (!c) return;

    // TODO: Figure out how to make these sync with WAGMI
    const p = await c.getProvider();
    console.log(p);
    console.log(c);
    p.scanQRCode();

    switch (c.id) {
      case 'coinbaseWallet':
        setConnectorUri(p.qrUrl);
        break;
      case 'walletConnect':
        p.connect();
        p.connector.on('display_uri', handleQRCode);
        break;
      case 'injected':
        // Shouldn't get to this flow, injected is not scannable
        break;
    }
  };

  useEffect(() => {
    if (!connectorUri) startConnect();
  }, []);

  if (!connector) return <>Connector not found</>;

  const browser = detectBrowser();
  const extensionUrl = connector.extensions
    ? connector.extensions[browser]
    : undefined;

  const suggestedExtension = connector.extensions
    ? {
        name: Object.keys(connector.extensions)[0],
        label:
          Object.keys(connector.extensions)[0].charAt(0).toUpperCase() +
          Object.keys(connector.extensions)[0].slice(1), // Capitalise first letter, but this might be better suited as a lookup table
        url: connector.extensions[Object.keys(connector.extensions)[0]],
      }
    : undefined;

  const hasExtensionInstalled =
    connector.extensionIsInstalled && connector.extensionIsInstalled();

  const dev = (
    <TestBench>
      <select onChange={(e: any) => setId(e.target.value)} value={id}>
        {Object.keys(supportedConnectors).map((key: any, i: number) => (
          /* @ts-ignore */
          <option key={i}>{supportedConnectors[key].id}</option>
        ))}
      </select>
    </TestBench>
  );

  if (!connector.scannable)
    return (
      <Container>
        {dev}
        <ModalHeading>Error</ModalHeading>
        <ModalContent>
          <ModalH1 error>
            <AlertIcon />
            {connector.name} does not have it's own QR Code to scan
          </ModalH1>
          <ModalBody>This state should never happen</ModalBody>
        </ModalContent>
      </Container>
    );

  return (
    <Container>
      {dev}
      <ModalHeading>Scan QR Code</ModalHeading>
      <ModalContent style={{ paddingBottom: 4, gap: 14 }}>
        <Tooltip message={'Open your preferred wallet and scan the QR code'}>
          <CustomQRCode value={connectorUri} image={connector.logo} />
        </Tooltip>
        <OrDivider />
      </ModalContent>

      {connector.defaultConnect && ( // Open the default connector modal
        <Button icon={connector.logo} onClick={connector.defaultConnect}>
          Open {connector.name}
        </Button>
      )}
      {hasExtensionInstalled && ( // Run the extension
        <Button icon={connector.logo} onClick={() => switchConnectMethod(id)}>
          Open {connector.name}
        </Button>
      )}
      {!hasExtensionInstalled && extensionUrl && (
        <Button href={extensionUrl} icon={<BrowserIcon />}>
          Install the Extension
        </Button>
      )}

      {!hasExtensionInstalled && suggestedExtension && (
        <Button
          href={suggestedExtension?.url}
          icon={<BrowserIcon browser={suggestedExtension?.name} />}
        >
          Install on {suggestedExtension?.label}
        </Button>
      )}
    </Container>
  );
};

export default ConnectWithQRCode;
