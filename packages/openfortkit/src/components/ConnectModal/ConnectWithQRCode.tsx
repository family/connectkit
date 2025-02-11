import React, { useEffect } from 'react';
import { routes, useOpenfortKit } from '../OpenfortKit';

import { useWalletConnectModal } from '../../hooks/useWalletConnectModal';

import {
  detectBrowser,
  isWalletConnectConnector
} from '../../utils';

import { OrDivider } from '../Common/Modal';
import { ModalContent, PageContent } from '../Common/Modal/styles';

import ScanIconWithLogos from '../../assets/ScanIconWithLogos';
import { ExternalLinkIcon } from '../../assets/icons';
import useLocales from '../../hooks/useLocales';
import Button from '../Common/Button';
import CopyToClipboard from '../Common/CopyToClipboard';
import CustomQRCode from '../Common/CustomQRCode';

import { useAccount, useDisconnect } from 'wagmi';
import { useConnectWithSiwe } from '../../hooks/openfort/useConnectWithSiwe';
import { useWallet } from '../../wallets/useWallets';
import { useWeb3 } from '../contexts/web3';

const ConnectWithQRCode: React.FC<{
  switchConnectMethod: (id?: string) => void;
}> = ({ switchConnectMethod }) => {
  const context = useOpenfortKit();

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

  const connectWithSiwe = useConnectWithSiwe();
  const { isConnected } = useAccount();
  const { log, setOpen } = useOpenfortKit();
  const { disconnect } = useDisconnect();

  const [isFirstFrame, setIsFirstFrame] = React.useState(true);
  useEffect(() => {
    // When the component is first rendered, we disconnect the user if they are connected
    if (isFirstFrame) {
      setIsFirstFrame(false);
      if (isConnected) {
        disconnect();
      }
    } else {
      // When connected with WalletConnect, we connect with SIWE
      if (isConnected) {
        connectWithSiwe({
          connectorType: 'walletConnect',
          walletClientType: 'walletConnect',
          onError: (error) => {
            log(error);
            disconnect();
          },
          onConnect: () => {
            setOpen(false);
          },
        });
      }
    }
  }, [isConnected]);

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
