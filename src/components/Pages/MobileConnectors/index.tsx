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

const MobileConnectors: React.FC = () => {
  const context = useContext();
  const { connectAsync } = useConnect();

  const { openDefaultWalletConnect } = useDefaultWalletConnect();
  /*
  const colors = [
    '#007AFF',
    '#5856D6',
    '#AF52DE',
    '#5AC8FA',
    '#34C759',
    '#FFCC00',
    '#FF9500',
    '#FF3B30',
  ];
*/
  const wallets = useDefaultWallets();

  const connectWallet = (wallet: WalletProps) => {
    const c = wallet.createConnector();
    c.connector.on('message', async ({ type }: any) => {
      if (type === 'connecting') {
        const uri = await c.mobile.getUri();
        console.log(uri);
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
                    logoBackground && {
                      background: logoBackground,
                    }
                  }
                >
                  {logos.mobile ?? logos.default}
                </WalletIcon>
                <WalletLabel>{shortName ?? name}</WalletLabel>
              </WalletItem>
            );
          })}
        </WalletList>
      </ModalContent>
      <Button icon={<ExternalLinkIcon />} onClick={openDefaultWalletConnect}>
        Open Default Modal
      </Button>
    </PageContent>
  );
};

export default MobileConnectors;
