import React from 'react';
import {
  Container,
  WalletList,
  WalletItem,
  WalletIcon,
  WalletLabel,
} from './styles';

import { PageContent, ModalContent } from '../../Common/Modal/styles';

import useDefaultWallets from '../../../wallets/useDefaultWallets';
import { routes, useContext } from '../../ConnectKit';
import { WalletProps } from '../../../wallets/wallet';
import { useWalletConnectModal } from '../../../hooks/useWalletConnectModal';
import CopyToClipboard from '../../Common/CopyToClipboard';
import useLocales from '../../../hooks/useLocales';

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

  const uri = context.walletConnectUri;

  const locales = useLocales();

  const { open: openW3M, isOpen: isOpenW3M } = useWalletConnectModal();

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
                  initial={{
                    opacity: 0.2,
                  }}
                  animate={
                    uri
                      ? {
                          opacity: 1,
                          transition: {
                            duration: 0.1,
                            ease: 'easeOut',
                          },
                        }
                      : {
                          opacity: [0.1, 0.8, 0.1],
                          transition: {
                            repeat: Infinity,
                            duration: 1,
                            ease: 'easeInOut',
                            delay: i * 0.02,
                          },
                        }
                  }
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
            <WalletItem onClick={openW3M} $waiting={isOpenW3M}>
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
