import React, { useEffect, useState } from 'react';
import {
  Container,
  WalletList,
  WalletItem,
  WalletIcon,
  WalletLabel,
} from './styles';

import { PageContent, ModalContent } from '../../Common/Modal/styles';

import { useConnect } from '../../../hooks/useConnect';
import useDefaultWallets from '../../../wallets/useDefaultWallets';
import { routes, useContext } from '../../ConnectKit';
import { WalletProps } from '../../../wallets/wallet';
import { useWalletConnectModal } from '../../../hooks/useWalletConnectModal';
import CopyToClipboard from '../../Common/CopyToClipboard';
import { walletConnect } from '../../../wallets/connectors/walletConnect';
import useLocales from '../../../hooks/useLocales';
import { useChains } from '../../../hooks/useChains';
import { useWalletConnectUri } from '../../../hooks/useWalletConnectUri';

const MoreIcon = (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 42V19M19 30.5H42"
      stroke="var(--ck-body-color-muted)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);
const MobileConnectors: React.FC = () => {
  const context = useContext();
  const { connectAsync } = useConnect();

  const { uri } = useWalletConnectUri();

  const locales = useLocales();

  const [defaultModalOpen, setDefaultModalOpen] = useState(false);
  const { open: openW3M } = useWalletConnectModal();
  const openDefaultConnect = async () => {
    setDefaultModalOpen(true);
    await openW3M();
    setDefaultModalOpen(false);
  };

  const wallets = useDefaultWallets().filter(
    (wallet: WalletProps) => wallet.installed === undefined // Do not show wallets that are injected connectors
  );

  const connectWallet = (wallet: WalletProps) => {
    if (wallet.installed) {
      context.setRoute(routes.CONNECT);
      context.setConnector(wallet.id);
    } else if (uri) {
      const deeplink = wallet.createUri?.(uri as string);
      window.location.href = deeplink as string;
    }
  };

  return (
    <PageContent style={{ width: 312 }}>
      <Container>
        <ModalContent>
          <WalletList>
            {wallets.map((wallet: WalletProps, i: number) => {
              const { name, shortName, logos, logoBackground } = wallet;
              return (
                <WalletItem
                  key={i}
                  onClick={() => connectWallet(wallet)}
                  $waiting={!uri}
                >
                  <WalletIcon
                    $outline={true}
                    style={
                      logoBackground
                        ? {
                            background: logoBackground,
                          }
                        : undefined
                    }
                  >
                    {logos.mobile ?? logos.default}
                  </WalletIcon>
                  <WalletLabel>{shortName ?? name}</WalletLabel>
                </WalletItem>
              );
            })}
            <WalletItem
              onClick={openDefaultConnect}
              $waiting={defaultModalOpen}
            >
              <WalletIcon
                style={{ background: 'var(--ck-body-background-secondary)' }}
              >
                {MoreIcon}
              </WalletIcon>
              <WalletLabel>{locales.more}</WalletLabel>
            </WalletItem>
          </WalletList>
        </ModalContent>
        {context.options?.walletConnectCTA !== 'modal' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              paddingTop: 16,
            }}
          >
            <CopyToClipboard variant="button" string={uri}>
              {locales.copyToClipboard}
            </CopyToClipboard>
          </div>
        )}
      </Container>
    </PageContent>
  );
};

export default MobileConnectors;
