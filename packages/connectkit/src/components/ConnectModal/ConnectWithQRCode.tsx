import React, { useState, useEffect } from 'react';
import { routes, useContext } from '../ConnectKit';

import supportedConnectors from '../../constants/supportedConnectors';
import { useConnect } from '../../hooks/useConnect';
import { useDefaultWalletConnect } from '../../hooks/useDefaultWalletConnect';

import { detectBrowser, isWalletConnectConnector } from '../../utils';

import {
  PageContent,
  ModalContent,
  ModalHeading,
} from '../Common/Modal/styles';
import { OrDivider } from '../Common/Modal';

import CustomQRCode from '../Common/CustomQRCode';
import Button from '../Common/Button';
import Alert from '../Common/Alert';
import ScanIconWithLogos from '../../assets/ScanIconWithLogos';
import { ExternalLinkIcon } from '../../assets/icons';
import CopyToClipboard from '../Common/CopyToClipboard';
import useLocales from '../../hooks/useLocales';

const ConnectWithQRCode: React.FC<{
  connectorId: string;
  switchConnectMethod: (id?: string) => void;
}> = ({ connectorId }) => {
  const context = useContext();

  const [id] = useState(connectorId);
  const connector = supportedConnectors.find((c) => c.id === id);

  const { connectors, connectAsync } = useConnect();
  const [connectorUri, setConnectorUri] = useState<string | undefined>(
    undefined
  );

  const locales = useLocales({
    CONNECTORNAME: connector?.name,
  });

  async function connectWallet(connector: any) {
    const result = await connectAsync({ connector: connector });

    if (result) {
      return result;
    }

    return false;
  }

  async function connectWalletConnect(connector: any) {
    const isLegacy = connector.id === 'walletConnectLegacy';

    connector.on('message', async ({ type, data }) => {
      console.log(type, data);
      if (type === 'connecting') {
        const p = await connector.getProvider();
        const uri = isLegacy ? p.connector.uri : p.signer.uri;
        setConnectorUri(uri);

        if (isLegacy) {
          p.connector.on('disconnect', () => {
            console.log('User rejected, regenerate QR code');
            // User rejected, regenerate QR code
            connectWallet(connector);
          });
        } else {
          p.on('disconnect', () => {
            console.log('User rejected, regenerate QR code');
            // User rejected, regenerate QR code
            connectWallet(connector);
          });
        }
      }
      if (type === 'display_uri' && !isLegacy) {
        setConnectorUri(data);
      }
    });

    try {
      await connectWallet(connector);
    } catch (error: any) {
      console.log('err', error);
      if (error.code) {
        switch (error.code) {
          case 4001:
            console.log('User rejected');
            connectWallet(connector); // Regenerate QR code
            break;
          default:
            console.log('Unknown error');
            break;
        }
      } else {
        // Sometimes the error doesn't respond with a code
        context.debug(
          <>WalletConnect cannot connect. See console for more details.</>,
          error
        );
      }
    }
  }

  const startConnect = async () => {
    const c = connectors.filter((c) => c.id === id)[0];
    if (!c || connectorUri) return;

    switch (c.id) {
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
      case 'walletConnectLegacy':
        connectWalletConnect(c);
        break;
    }
  };

  const [defaultModalOpen, setDefaultModalOpen] = useState(false);
  const { openDefaultWalletConnect } = useDefaultWalletConnect();
  const openDefaultConnect = async () => {
    const c = connectors.find((c) => c.id === id);
    if (isWalletConnectConnector(c?.id)) {
      setDefaultModalOpen(true);
      await openDefaultWalletConnect();
      setDefaultModalOpen(false);
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
      <ModalContent style={{ paddingBottom: 8, gap: 14 }}>
        <CustomQRCode
          value={connectorUri}
          image={connector.logos.qrCode}
          imageBackground={connector.logoBackground}
          tooltipMessage={
            isWalletConnectConnector(connectorId) ? (
              <>
                <ScanIconWithLogos />
                <span>{locales.scanScreen_tooltip_walletConnect}</span>
              </>
            ) : (
              <>
                <ScanIconWithLogos logo={connector.logos.connectorButton} />
                <span>{locales.scanScreen_tooltip_default}</span>
              </>
            )
          }
        />
        {showAdditionalOptions ? (
          <OrDivider />
        ) : (
          hasApps && <OrDivider>{locales.dontHaveTheApp}</OrDivider>
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
                ? locales.copyToClipboard
                : locales.copyCode}
            </CopyToClipboard>
          )}
          {context.options?.walletConnectCTA !== 'link' && (
            <Button
              icon={<ExternalLinkIcon />}
              onClick={openDefaultConnect}
              waiting={defaultModalOpen}
            >
              {context.options?.walletConnectCTA === 'modal'
                ? locales.useWalletConnectModal
                : locales.useModal}
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
          {locales.installTheExtension}
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
            {locales.getWalletName}
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
