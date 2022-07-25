import React from 'react';
import {
  Container,
  WalletList,
  WalletItem,
  WalletIcon,
  WalletLabel,
} from './styles';

import {
  PageContent,
  ModalContent,
  ModalHeadingBlock,
} from '../../Common/Modal/styles';

import Button from '../../Common/Button';

import { ExternalLinkIcon } from '../../../assets/icons';
import { useConnect } from '../../../hooks/useConnect';
import useDefaultWallets from '../../../wallets/useDefaultWallets';
import { routes, useContext } from '../../ConnectKit';
import { WalletProps } from '../../../wallets/wallet';
import { useDefaultWalletConnect } from '../../../hooks/useDefaultWalletConnect';

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
      stroke="var(--body-color-muted)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);
const MobileConnectors: React.FC = () => {
  const context = useContext();
  const { connectAsync } = useConnect();

  const { openDefaultWalletConnect } = useDefaultWalletConnect();
  const wallets = useDefaultWallets().filter(
    (wallet: WalletProps) => wallet.installed === undefined // Do not show wallets that are injected connectors
  );

  const connectWallet = (wallet: WalletProps) => {
    const c = wallet.createConnector();

    if (wallet.installed) {
      context.setRoute(routes.CONNECT);
      context.setConnector(c.connector.id);
    } else {
      c.connector.on('message', async ({ type }: any) => {
        if (type === 'connecting') {
          const uri = await c.mobile.getUri();
          window.location.href = uri;
        }
      });

      try {
        connectAsync({ connector: c.connector });
      } catch (err) {
        context.debug(
          'Async connect error. See console for more details.',
          err
        );
      }
    }
  };

  return (
    <PageContent style={{ width: 312, height: 367 }}>
      <ModalHeadingBlock />
      <Container>
        <ModalContent>
          <WalletList>
            {wallets.map((wallet: WalletProps, i: number) => {
              const { name, shortName, logos, logoBackground } = wallet;
              return (
                <WalletItem key={i} onClick={() => connectWallet(wallet)}>
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
            <div className="mobile-hide">
              <WalletItem onClick={openDefaultWalletConnect}>
                <WalletIcon
                  style={{ background: 'var(--body-background-secondary)' }}
                >
                  {MoreIcon}
                </WalletIcon>
                <WalletLabel>More</WalletLabel>
              </WalletItem>
            </div>
          </WalletList>
        </ModalContent>
        <div className="mobile-show">
          <Button
            icon={<ExternalLinkIcon />}
            onClick={openDefaultWalletConnect}
          >
            Open Default Modal
          </Button>
        </div>
      </Container>
    </PageContent>
  );
};

export default MobileConnectors;
