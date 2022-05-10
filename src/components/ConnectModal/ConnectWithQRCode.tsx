import React, { useState, useEffect } from 'react';
import { routes, useContext } from '../FamilyKit';
import localizations, { localize } from '../../constants/localizations';

import supportedConnectors from '../../constants/supportedConnectors';
import { useConnect } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { detectBrowser } from '../../utils';

import { ModalContent, ModalHeading } from '../Modal/styles';
import { OrDivider } from '../Modal';

import CustomQRCode from '../CustomQRCode';
import Button from '../Button';
import Alert from '../Alert';
import BrowserIcon from '../BrowserIcon';
import ScanIconWithLogos from '../../assets/ScanIconWithLogos';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;

const ExternalLinkIcon = ({ ...props }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13 9.66667V12C13 13.6569 11.6569 15 10 15H4C2.34315 15 1 13.6569 1 12V6C1 4.34315 2.34315 3 4 3H6.33333"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.3"
    />
    <path
      d="M8 8L14 2L15 1M15 1V5.5M15 1H10.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="0.3"
    />
  </svg>
);

const ConnectWithQRCode: React.FC<{
  connectorId: string;
  switchConnectMethod: (id?: string) => void;
}> = ({ connectorId, switchConnectMethod }) => {
  const context = useContext();
  const copy = localizations[context.lang].scanScreen;

  const [id, setId] = useState(connectorId);
  const connector = supportedConnectors.filter((c) => c.id === id)[0];

  const { connectors, connectAsync } = useConnect({
    onBeforeConnect: (connector: any) => {
      //console.log('onBeforeConnect', connector);
    },
    onSettled(data, error) {
      //console.log('error', error);
      //console.log('data', data);
    },
  });
  const [connectorUri, setConnectorUri] = useState<string | null>(null);

  const localizeText = (text: string) => {
    return localize(text, {
      CONNECTORNAME: connector.name,
    });
  };

  async function connectWallet(connector: any) {
    const result = await connectAsync(connector);

    if (result) {
      console.log(result);
      return result;
    }

    return false;
  }

  const startConnect = async () => {
    const c = connectors.filter((c) => c.id === id)[0];
    if (!c || connectorUri) return;

    switch (c.id) {
      case 'injected':
        // Shouldn't get to this flow, injected is not scannable
        break;
      case 'coinbaseWallet':
        c.on('message', async (e) => {
          const p = await c.getProvider();
          setConnectorUri(p.qrUrl);
        });
        await connectWallet(c);
        break;
      case 'walletConnect':
        c.on('message', async (e) => {
          //@ts-ignore
          const p = await c.getProvider();
          setConnectorUri(p.connector.uri);
        });
        await connectWallet(c);
        break;
      case 'metaMask':
        break;
    }
  };

  const openDefaultConnect = async () => {
    const c = connectors.filter((c) => c.id === id)[0];
    if (c.id === 'walletConnect') {
      const co = new WalletConnectConnector({
        options: {
          qrcode: true,
        },
      });
      await connectWallet(co);
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

  if (!connector.scannable)
    return (
      <Container>
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
      <ModalHeading>
        {connectorId === 'walletConnect'
          ? copy.heading
          : `Scan with ${connector.name}`}
      </ModalHeading>
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
        <Button
          icon={
            <ExternalLinkIcon
              style={{
                transform: 'scale(0.75)',
                left: 3,
                top: 0,
              }}
            />
          }
          onClick={openDefaultConnect}
        >
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
              onClick={() => {
                context.setRoute(routes.DOWNLOAD);
              }}
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
