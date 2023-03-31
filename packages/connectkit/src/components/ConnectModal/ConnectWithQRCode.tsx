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
import { useWallet } from '../../wallets/useDefaultWallets';

const ConnectWithQRCode: React.FC<{
  walletId: string;
  switchConnectMethod: (id?: string) => void;
}> = ({ walletId }) => {
  const context = useContext();

  const { wallet } = useWallet(walletId);

  const { uri } = isWalletConnectConnector(wallet?.id)
    ? useWalletConnectUri()
    : isCoinbaseWalletConnector(wallet?.id)
    ? useCoinbaseWalletUri()
    : //: { uri: undefined };
      useWalletConnectUri();
  const locales = useLocales({
    CONNECTORNAME: wallet?.name,
  });

  const { open: openW3M, isOpen: isOpenW3M } = useWalletConnectModal();

  if (!wallet) return <>Wallet {walletId} not found</>;

  const browser = detectBrowser();
  const extensionUrl = wallet?.downloadUrls?.[browser];

  const hasApps =
    wallet?.downloadUrls && Object.keys(wallet?.downloadUrls).length !== 0;

  const suggestedExtension = wallet?.downloadUrls
    ? {
        name: Object.keys(wallet?.downloadUrls)[0],
        label:
          Object.keys(wallet?.downloadUrls)[0].charAt(0).toUpperCase() +
          Object.keys(wallet?.downloadUrls)[0].slice(1), // Capitalise first letter, but this might be better suited as a lookup table
        url: wallet?.downloadUrls[Object.keys(wallet?.downloadUrls)[0]],
      }
    : undefined;

  if (!wallet?.scannable)
    return (
      <PageContent>
        <ModalHeading>Invalid State</ModalHeading>
        <ModalContent>
          <Alert>{wallet?.name} does not have it's own QR Code to scan.</Alert>
        </ModalContent>
      </PageContent>
    );

  const showAdditionalOptions = isWalletConnectConnector(walletId);

  return (
    <PageContent>
      <ModalContent style={{ paddingBottom: 8, gap: 14 }}>
        <CustomQRCode
          value={uri}
          image={wallet?.logos.qrCode ?? wallet?.logos.default}
          imageBackground={wallet?.logoBackground}
          tooltipMessage={
            isWalletConnectConnector(walletId) ? (
              <>
                <ScanIconWithLogos />
                <span>{locales.scanScreen_tooltip_walletConnect}</span>
              </>
            ) : (
              <>
                <ScanIconWithLogos logo={wallet?.logos.connectorButton} />
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
          icon={wallet?.logos.default}
          roundedIcon
          onClick={() => switchConnectMethod(id)}
        >
          Open {wallet?.name}
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
              <div style={{ background: wallet?.logoBackground }}>
                {wallet?.logos.default}
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
