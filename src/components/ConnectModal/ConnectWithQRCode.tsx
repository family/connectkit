import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import CustomQRCode from '../CustomQRCode';
import Button from '../Button';
import { useConnect } from 'wagmi';
import { Listener } from '@ethersproject/abstract-provider';
import { OrDivider } from '../Modal';
import { ModalContent, ModalHeading } from '../Modal/styles';
import { detectBrowser } from '../../utils';
import BrowserIcon from '../BrowserIcon';

import supportedConnectors from '../../constants/supportedConnectors';
import TestBench from '../TestBench';
import ScanIconWithLogos from '../../assets/ScanIconWithLogos';
import Alert from '../Alert';
import { useContext } from '../FamilyKit';
import localizations, { localize } from '../../constants/localizations';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;

const ConnectWithQRCode: React.FC<{
  connectorId: string;
  switchConnectMethod: (id?: string) => void;
}> = ({ connectorId, switchConnectMethod }) => {
  const context = useContext();
  const copy = localizations[context.lang].scanScreen;

  const [id, setId] = useState(connectorId);
  const connector = supportedConnectors.filter((c) => c.id === id)[0];

  const { connect, connectors } = useConnect();
  const [connectorUri, setConnectorUri] = useState<string | null>(null);

  const localizeText = (text: string) => {
    return localize(text, {
      CONNECTORNAME: connector.name,
    });
  };

  const startConnect = async () => {
    const c = connectors.filter((c) => c.id === id)[0];
    if (!c || connectorUri) return;

    switch (c.id) {
      case 'coinbaseWallet':
        c.on('message', async (e) => {
          const p = await c.getProvider();
          setConnectorUri(p.qrUrl);
        });
        connect(c);
        break;
      case 'walletConnect':
        c.on('message', async (e) => {
          //@ts-ignore
          const p = await c.getProvider();
          setConnectorUri(p.connector.uri);
        });
        connect(c);
        break;
      case 'injected':
        // Shouldn't get to this flow, injected is not scannable
        break;
      case 'metaMask':
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

  const hasApps =
    connector.appUrls && Object.keys(connector.appUrls).length !== 0;

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
      <ModalHeading>{copy.heading}</ModalHeading>
      <ModalContent style={{ paddingBottom: 4, gap: 14 }}>
        <CustomQRCode
          value={connectorUri}
          image={connector.logo}
          tooltipMessage={
            connectorId === 'walletConnect' ? (
              <>
                <ScanIconWithLogos />
                <span>{localizeText(copy.tooltip.walletConnect)}</span>
              </>
            ) : (
              <>
                <ScanIconWithLogos logo={connector.logo} />
                <span>{localizeText(copy.tooltip.default)}</span>
              </>
            )
          }
        />
        {connector.defaultConnect || hasExtensionInstalled || extensionUrl ? (
          <OrDivider />
        ) : (
          hasApps && <OrDivider text="Don't have the app?" />
        )}
      </ModalContent>

      {connector.defaultConnect && ( // Open the default connector modal
        <Button icon={connector.logo} onClick={connector.defaultConnect}>
          Open Default Modal
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

      {!hasExtensionInstalled &&
        !extensionUrl &&
        (hasApps ? (
          <>
            <Button
              onClick={() => alert('TODO: Open new QR code')}
              icon={connector.logo}
            >
              Get {connector.name}
            </Button>
          </>
        ) : (
          suggestedExtension && (
            <Button
              href={suggestedExtension?.url}
              icon={<BrowserIcon browser={suggestedExtension?.name} />}
            >
              Install on {suggestedExtension?.label}
            </Button>
          )
        ))}
    </Container>
  );
};

export default ConnectWithQRCode;
