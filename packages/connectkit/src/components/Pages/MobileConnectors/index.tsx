import React from 'react';
import {
  Container,
  WalletList,
  WalletItem,
  WalletIcon,
  WalletLabel,
} from './styles';

import { PageContent, ModalContent } from '../../Common/Modal/styles';

import useLegacyWallets from '../../../wallets/useLegacyWallets';
import { LegacyWalletProps } from '../../../wallets/wallet';

import { routes, useContext } from '../../ConnectKit';
import { useWalletConnectModal } from '../../../hooks/useWalletConnectModal';
import CopyToClipboard from '../../Common/CopyToClipboard';
import useLocales from '../../../hooks/useLocales';
import { useWalletConnectUri } from '../../../hooks/connectors/useWalletConnectUri';
import { Spinner } from '../../Common/Spinner';
import { isWalletConnectConnector } from '../../../utils';
import { ScrollArea } from '../../Common/ScrollArea';

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
  const locales = useLocales();

  const { uri: wcUri } = useWalletConnectUri();
  const { open: openW3M, isOpen: isOpenW3M } = useWalletConnectModal();
  const wallets = useLegacyWallets().filter(
    (wallet: LegacyWalletProps) =>
      (wallet.installed === undefined || !wallet.installed) &&
      wallet.createUri && // Do not show wallets that are injected connectors
      !isWalletConnectConnector(wallet.id) // Do not show WalletConnect
  );

  const connectWallet = (wallet: LegacyWalletProps) => {
    if (wallet.installed) {
      context.setRoute(routes.CONNECT);
      context.setConnector({ id: wallet.id, name: wallet.name });
    } else {
      const uri = wallet.createUri?.(wcUri!);
      if (uri) window.location.href = uri;
      //if (uri) window.open(uri, '_blank');
    }
  };

  return (
    <PageContent style={{ width: 312 }}>
      <Container>
        <ModalContent style={{ paddingBottom: 0 }}>
          <ScrollArea height={340}>
            <WalletList $disabled={!wcUri}>
              {wallets.map((wallet: LegacyWalletProps, i: number) => {
                const { name, shortName, icon, installed } = wallet;
                return (
                  <WalletItem
                    key={i}
                    onClick={() => connectWallet(wallet)}
                    style={{
                      animationDelay: `${i * 50}ms`,
                    }}
                  >
                    <WalletIcon $outline={true}>{icon}</WalletIcon>
                    <WalletLabel>{shortName ?? name}</WalletLabel>
                  </WalletItem>
                );
              })}
              <WalletItem onClick={openW3M} $waiting={isOpenW3M}>
                <WalletIcon
                  style={{ background: 'var(--ck-body-background-secondary)' }}
                >
                  {isOpenW3M ? (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                        }}
                      >
                        <Spinner />
                      </div>
                    </div>
                  ) : (
                    MoreIcon
                  )}
                </WalletIcon>
                <WalletLabel>{locales.more}</WalletLabel>
              </WalletItem>
            </WalletList>
          </ScrollArea>
        </ModalContent>
        {context.options?.walletConnectCTA !== 'modal' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              paddingTop: 8,
            }}
          >
            <CopyToClipboard variant="button" string={wcUri}>
              {locales.copyToClipboard}
            </CopyToClipboard>
          </div>
        )}
      </Container>
    </PageContent>
  );
};

export default MobileConnectors;
