import React from 'react';
import { routes, useContext } from '../ConnectKit';

import { useWalletConnectModal } from '../../hooks/useWalletConnectModal';

import {
  detectBrowser,
  isCoinbaseWalletConnector,
  isWalletConnectConnector,
} from '../../utils';

import { PageContent, ModalContent } from '../Common/Modal/styles';
import { OrDivider } from '../Common/Modal';

import CustomQRCode from '../Common/CustomQRCode';
import Button from '../Common/Button';
import ScanIconWithLogos from '../../assets/ScanIconWithLogos';
import { ExternalLinkIcon } from '../../assets/icons';
import CopyToClipboard from '../Common/CopyToClipboard';
import useLocales from '../../hooks/useLocales';

import { useWallet } from '../../wallets/useWallets';
import { useWeb3 } from '../contexts/web3';

const ConnectWithQRCode: React.FC<{
  switchConnectMethod: (id?: string) => void;
}> = ({ switchConnectMethod }) => {
  const context = useContext();

  const id = context.connector.id;

  const wallet = useWallet(context.connector.id);

  const { open: openW3M, isOpen: isOpenW3M } = useWalletConnectModal();
  const {
    connect: { getUri },
  } = useWeb3();

  const wcUri = getUri(id);
  const uri = wcUri
    ? wallet?.getWalletConnectDeeplink?.(wcUri) ?? wcUri
    : undefined;

  const locales = useLocales({
    CONNECTORNAME: wallet?.name,
  });

  if (!wallet) return <>Wallet not found {context.connector.id}</>;

  const downloads = wallet?.downloadUrls;
  const extensions = {
    chrome: downloads?.chrome,
    firefox: downloads?.firefox,
    brave: downloads?.brave,
    edge: downloads?.edge,
    safari: downloads?.safari,
  };

  const browser = detectBrowser();

  const hasApps = downloads && Object.keys(downloads).length !== 0;

  const suggestedExtension = extensions
    ? {
        name: Object.keys(extensions)[0],
        label:
          Object.keys(extensions)[0]?.charAt(0).toUpperCase() +
          Object.keys(extensions)[0]?.slice(1), // Capitalise first letter, but this might be better suited as a lookup table
        url: extensions[Object.keys(extensions)[0]],
      }
    : undefined;

  const showAdditionalOptions = isWalletConnectConnector(id);

  return (
    <PageContent>
      <ModalContent style={{ paddingBottom: 8, gap: 14 }}>
        <CustomQRCode
          value={uri}
          image={wallet?.icon}
          tooltipMessage={
            isWalletConnectConnector(id) ? (
              <>
                <ScanIconWithLogos />
                <span>{locales.scanScreen_tooltip_walletConnect}</span>
              </>
            ) : (
              <>
                <ScanIconWithLogos logo={wallet?.icon} />
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
              <div style={{ background: connectorInfo?.icon }}>
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
