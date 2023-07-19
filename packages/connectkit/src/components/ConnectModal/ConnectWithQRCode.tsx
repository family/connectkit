import React, { useState } from 'react';
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

import { useWalletConnectUri } from '../../hooks/connectors/useWalletConnectUri';
import { useCoinbaseWalletUri } from '../../hooks/connectors/useCoinbaseWalletUri';

const ConnectWithQRCode: React.FC<{
  connectorId: string;
  switchConnectMethod: (id?: string) => void;
}> = ({ connectorId }) => {
  const context = useContext();

  const [id] = useState(connectorId);

  const { connectors } = useConnect();

  const { uri } = isWalletConnectConnector(id)
    ? useWalletConnectUri()
    : isCoinbaseWalletConnector(id)
    ? useCoinbaseWalletUri()
    : { uri: undefined };

  const connector = connectors.find((c) => c.id === id);
  const connectorInfo = supportedConnectors.find((c) => c.id === id);

  const locales = useLocales({
    CONNECTORNAME: connector?.name,
  });

  const { open: openW3M, isOpen: isOpenW3M } = useWalletConnectModal();

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
          Object.keys(connectorInfo?.extensions)[0]?.charAt(0).toUpperCase() +
          Object.keys(connectorInfo?.extensions)[0]?.slice(1), // Capitalise first letter, but this might be better suited as a lookup table
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

  const showAdditionalOptions = isWalletConnectConnector(connectorId);

  return (
    <PageContent>
      <ModalContent style={{ paddingBottom: 8, gap: 14 }}>
        <CustomQRCode
          value={uri}
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
            <CopyToClipboard variant="button" string={uri}>
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
