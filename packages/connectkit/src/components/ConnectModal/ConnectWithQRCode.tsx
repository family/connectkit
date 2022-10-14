import React, { useState, useEffect } from 'react';
import { routes, useContext } from '../ConnectKit';
import localizations, { localize } from '../../constants/localizations';

import supportedConnectors from '../../constants/supportedConnectors';
import { useConnect } from '../../hooks/useConnect';
import { useDefaultWalletConnect } from '../../hooks/useDefaultWalletConnect';

import { detectBrowser } from '../../utils';

import {
  PageContent,
  ModalContent,
  ModalHeading,
  ModalHeadingBlock,
} from '../Common/Modal/styles';
import { OrDivider } from '../Common/Modal';

import CustomQRCode from '../Common/CustomQRCode';
import Button from '../Common/Button';
import Alert from '../Common/Alert';
import ScanIconWithLogos from '../../assets/ScanIconWithLogos';
import { ExternalLinkIcon } from '../../assets/icons';
import CopyToClipboard from '../Common/CopyToClipboard';

const ConnectWithQRCode: React.FC<{
  connectorId: string;
  switchConnectMethod: (id?: string) => void;
}> = ({ connectorId }) => {
  const context = useContext();
  const copy = localizations[context.lang].scanScreen;

  const [id, setId] = useState(connectorId);
  const connector = supportedConnectors.filter((c) => c.id === id)[0];

  const { connectors, connectAsync } = useConnect();
  const [connectorUri, setConnectorUri] = useState<string | undefined>(
    undefined
  );

  const localizeText = (text: string) => {
    return localize(text, {
      CONNECTORNAME: connector.name,
    });
  };

  async function connectWallet(connector: any) {
    const result = await connectAsync({ connector: connector });

    if (result) {
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
      case 'metaMask':
        // Shouldn't get to this flow, injected is not scannable
        break;
      case 'coinbaseWallet':
        c.on('message', async (e) => {
          const p = await c.getProvider();
          setConnectorUri(p.qrUrl);
        });
        try {
          await connectWallet(c);
        } catch (err) {
          context.debug(
            <>
              This dApp is most likely missing the{' '}
              <code>headlessMode: true</code> flag in the custom{' '}
              <code>CoinbaseWalletConnector</code> options. See{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://connect.family.co/v0/docs/cbwHeadlessMode"
              >
                documentation
              </a>{' '}
              for more details.
            </>,
            err
          );
        }
        break;
      case 'walletConnect':
        c.on('message', async (e) => {
          //@ts-ignore
          const p = await c.getProvider();
          setConnectorUri(p.connector.uri);

          // User rejected, regenerate QR code
          p.connector.on('disconnect', () => {
            connectWallet(c);
          });
        });
        try {
          await connectWallet(c);
        } catch (err) {
          context.debug(
            <>WalletConnect cannot connect. See console for more details.</>,
            err
          );
        }
        break;
    }
  };

  const { openDefaultWalletConnect } = useDefaultWalletConnect();
  const openDefaultConnect = async () => {
    const c = connectors.filter((c) => c.id === id)[0];
    if (c.id === 'walletConnect') {
      openDefaultWalletConnect();
    } else {
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
      <PageContent>
        <ModalHeading>Invalid State</ModalHeading>
        <ModalContent>
          <Alert>
            {connector.name} does not have it's own QR Code to scan. This state
            should never happen
          </Alert>
        </ModalContent>
      </PageContent>
    );

  const showAdditionalOptions = connector.defaultConnect;

  return (
    <PageContent>
      {/* <ModalHeading>
        {connectorId === 'walletConnect'
          ? copy.heading
          : `Scan with ${connector.name}`}
      </ModalHeading> */}
      <ModalHeadingBlock />
      <ModalContent style={{ paddingBottom: 8, gap: 14 }}>
        <CustomQRCode
          value={connectorUri}
          image={connector.logos.qrCode}
          imageBackground={connector.logoBackground}
          tooltipMessage={
            connectorId === 'walletConnect' ? (
              <>
                <ScanIconWithLogos />
                <span>{localizeText(copy.tooltip.walletConnect)}</span>
              </>
            ) : (
              <>
                <ScanIconWithLogos logo={connector.logos.connectorButton} />
                <span>{localizeText(copy.tooltip.default)}</span>
              </>
            )
          }
        />
        {showAdditionalOptions ? (
          <OrDivider />
        ) : (
          hasApps && <OrDivider>{`Don’t have the app?`}</OrDivider>
        )}
      </ModalContent>

      {showAdditionalOptions && ( // for walletConnect
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          {context.options?.walletConnectCTA !== 'modal' && (
            <CopyToClipboard variant="button" string={connectorUri}>
              {context.options?.walletConnectCTA === 'link'
                ? `Copy to Clipboard`
                : `Copy Code`}
            </CopyToClipboard>
          )}
          {context.options?.walletConnectCTA !== 'link' && (
            <Button icon={<ExternalLinkIcon />} onClick={openDefaultConnect}>
              {context.options?.walletConnectCTA === 'modal'
                ? `Use WalletConnect Modal`
                : `Use Modal`}
            </Button>
          )}
        </div>
      )}

      {/*
      {hasExtensionInstalled && ( // Run the extension
        <Button
          icon={connector.logos.default}
          roundedIcon
          onClick={() => switchConnectMethod(id)}
        >
          Open {connector.name}
        </Button>
      )}

      {!hasExtensionInstalled && extensionUrl && (
        <Button href={extensionUrl} icon={<BrowserIcon />}>
          Install the Extension
        </Button>
      )}
      */}

      {hasApps && (
        <>
          <Button
            onClick={() => {
              context.setRoute(routes.DOWNLOAD);
            }}
            /*
            icon={
              <div style={{ background: connector.logoBackground }}>
                {connector.logos.default}
              </div>
            }
            roundedIcon
            */
            download
          >
            Get {connector.name}
          </Button>
        </>
      )}
      {/*
        {suggestedExtension && (
          <Button
            href={suggestedExtension?.url}
            icon={<BrowserIcon browser={suggestedExtension?.name} />}
          >
            Install on {suggestedExtension?.label}
          </Button>
        }
        */}
    </PageContent>
  );
};

export default ConnectWithQRCode;
