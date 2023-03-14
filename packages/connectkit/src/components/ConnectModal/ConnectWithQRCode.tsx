import React, { useState, useEffect } from 'react';
import { routes, useContext } from '../ConnectKit';

import supportedConnectors from '../../constants/supportedConnectors';
import { useConnect } from '../../hooks/useConnect';
import { useWalletConnectModal } from '../../hooks/useWalletConnectModal';

import {
  detectBrowser,
  isWalletConnectConnector,
  isCoinbaseWalletConnector,
} from '../../utils';

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

  const { connectors, connectAsync } = useConnect();
  const [connectorUri, setConnectorUri] = useState<string | undefined>(
    undefined
  );

  const connector = connectors.find((c) => c.id === id);
  const connectorInfo = supportedConnectors.find((c) => c.id === id);
  const isWalletConnectLegacy = connector?.id === 'walletConnectLegacy';

  const locales = useLocales({
    CONNECTORNAME: connector?.name,
  });

  useEffect(() => {
    if (isWalletConnectConnector(connector?.id)) {
      connector?.on('message', async ({ type, data }: any) => {
        console.log(type, data);
        if (isWalletConnectLegacy) {
          console.log('isWalletConnectLegacy');
          if (type === 'connecting') {
            const p = await connector.getProvider();
            const uri = p.connector.uri;
            setConnectorUri(uri);

            // User rejected, regenerate QR code
            p.connector.on('disconnect', () => {
              console.log('User rejected, regenerate QR code');
              connectWalletConnect(connector);
            });
          }
        } else {
          if (type === 'display_uri') {
            setConnectorUri(data);
          }
          /*
          // This has the URI as well, but we're probably better off using the one in the display_uri event
          if (type === 'connecting') {
            const p = await connector.getProvider();
            const uri = p.signer.uri; 
            setConnectorUri(uri);
          }
          */
        }
      });
    }
    if (isCoinbaseWalletConnector(connector?.id)) {
      connector?.on('message', async () => {
        const p = await connector.getProvider();
        setConnectorUri(p.qrUrl);
      });
    }
    return () => {
      if (isWalletConnectConnector(connector?.id)) connector?.off('message');
      if (isCoinbaseWalletConnector(connector?.id)) connector?.off('message');
    };
  }, [connector]);

  async function connectWallet(connector: any) {
    const result = await connectAsync({ connector: connector });
    if (result) return result;
    return false;
  }

  async function connectWalletConnect(connector: any) {
    try {
      await connectWallet(connector);
    } catch (error: any) {
      console.log('catch error');
      console.log(error);
      if (error.code) {
        switch (error.code) {
          case 4001:
            console.log('error.code – User rejected');
            connectWalletConnect(connector); // Regenerate QR code
            break;
          default:
            console.log('error.code – Unknown Error');
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
    if (!connector || connectorUri) return;

    switch (connector.id) {
      case 'coinbaseWallet':
        try {
          await connectWallet(connector);
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
        connectWalletConnect(connector);
        break;
    }
  };

  const { open: openW3M, isOpen: isOpenW3M } = useWalletConnectModal();

  useEffect(() => {
    if (!connectorUri) startConnect();
  }, []);

  if (!connector) return <>Connector not found</>;

  const browser = detectBrowser();
  const extensionUrl = connectorInfo?.extensions
    ? connectorInfo.extensions[browser]
    : undefined;

  const hasApps =
    connectorInfo?.appUrls && Object.keys(connectorInfo?.appUrls).length !== 0;

  const suggestedExtension = connectorInfo?.extensions
    ? {
        name: Object.keys(connectorInfo?.extensions)[0],
        label:
          Object.keys(connectorInfo?.extensions)[0].charAt(0).toUpperCase() +
          Object.keys(connectorInfo?.extensions)[0].slice(1), // Capitalise first letter, but this might be better suited as a lookup table
        url: connectorInfo?.extensions[
          Object.keys(connectorInfo?.extensions)[0]
        ],
      }
    : undefined;

  const hasExtensionInstalled =
    connectorInfo?.extensionIsInstalled &&
    connectorInfo?.extensionIsInstalled();

  if (!connectorInfo?.scannable)
    return (
      <PageContent>
        <ModalHeading>Invalid State</ModalHeading>
        <ModalContent>
          <Alert>
            {connectorInfo?.name} does not have it's own QR Code to scan. This
            state should never happen
          </Alert>
        </ModalContent>
      </PageContent>
    );

  const showAdditionalOptions = connectorInfo?.defaultConnect;

  return (
    <PageContent>
      <ModalContent style={{ paddingBottom: 8, gap: 14 }}>
        <CustomQRCode
          value={connectorUri}
          image={connectorInfo?.logos.qrCode}
          imageBackground={connectorInfo?.logoBackground}
          tooltipMessage={
            isWalletConnectConnector(connectorId) ? (
              <>
                <ScanIconWithLogos />
                <span>{locales.scanScreen_tooltip_walletConnect}</span>
              </>
            ) : (
              <>
                <ScanIconWithLogos
                  logo={connectorInfo?.logos.connectorButton}
                />
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
              onClick={openW3M}
              disabled={isOpenW3M}
              waiting={isOpenW3M}
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
          icon={connectorInfo?.logos.default}
          roundedIcon
          onClick={() => switchConnectMethod(id)}
        >
          Open {connectorInfo?.name}
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
              <div style={{ background: connectorInfo?.logoBackground }}>
                {connectorInfo?.logos.default}
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
