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
import ScanIconWithLogos from '../../assets/ScanIconWithLogos';
import Alert from '../Alert';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;

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
        <ModalHeading>Invalid State</ModalHeading>
        <ModalContent>
          <Alert>
            {connector.name} does not have it's own QR Code to scan. This state
            should never happen
          </Alert>
        </ModalContent>
      </Container>
    );

  return (
    <Container>
      {dev}
      <ModalHeading>Scan QR Code</ModalHeading>
      <ModalContent style={{ paddingBottom: 4, gap: 14 }}>
        <Tooltip
          message={
            <>
              <ScanIconWithLogos />
              Open your preferred wallet and scan the QR code
            </>
          }
        >
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

      {!hasExtensionInstalled && !extensionUrl && suggestedExtension && (
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
