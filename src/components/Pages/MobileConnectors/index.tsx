import React from 'react';
import { WalletList, WalletItem, WalletIcon, WalletLabel } from './styles';

import {
  PageContent,
  ModalContent,
  ModalHeadingBlock,
} from '../../Common/Modal/styles';

import Button from '../../Common/Button';

import { ExternalLinkIcon } from '../../../assets/icons';
import { useConnect } from '../../../hooks/useConnect';
import useDefaultWallets from '../../../wallets/useDefaultWallets';
import { useContext } from '../../ConnectKit';
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
  const wallets = useDefaultWallets();

  const connectWallet = (wallet: WalletProps) => {
    const c = wallet.createConnector();

    c.connector.on('message', async ({ type }: any) => {
      if (type === 'connecting') {
        const uri = await c.mobile.getUri();
        window.location.href = uri;
      }
    });

    try {
      connectAsync(c.connector);
    } catch (err) {
      context.debug('Async connect error', err);
    }
  };

  return (
    <PageContent style={{ width: 312 }}>
      <ModalHeadingBlock />
      <ModalContent>
        <WalletList>
          {wallets.map((wallet: WalletProps, i: number) => {
            const { name, shortName, logos, logoBackground } = wallet;
            return (
              <WalletItem key={i} onClick={() => connectWallet(wallet)}>
                <WalletIcon
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
          <WalletItem onClick={openDefaultWalletConnect}>
            <WalletIcon
              style={{ background: 'var(--body-background-secondary)' }}
            >
              {MoreIcon}
            </WalletIcon>
            <WalletLabel>More</WalletLabel>
          </WalletItem>
        </WalletList>
      </ModalContent>
      <Button icon={<ExternalLinkIcon />} onClick={openDefaultWalletConnect}>
        Open Default Modal
      </Button>
    </PageContent>
  );
};

export default MobileConnectors;
