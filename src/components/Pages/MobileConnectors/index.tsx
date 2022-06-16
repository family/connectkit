import React from 'react';
import { WalletList, WalletItem, WalletIcon, WalletLabel } from './styles';

import {
  PageContent,
  ModalContent,
  ModalHeadingBlock,
} from '../../Common/Modal/styles';

import Button from '../../Common/Button';

import { ExternalLinkIcon } from '../../../assets/icons';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { useConnect } from 'wagmi';

const MobileConnectors: React.FC = () => {
  const { connectAsync, connectors } = useConnect({
    onError(e) {
      console.log(e);
    },
  });
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

  const wallets = [
    'Coinbase',
    'Trust',
    'MetaMask',
    'Spot',
    'Coinbase',
    'Trust',
    'MetaMask',
    'Spot',
    'Coinbase',
    'Trust',
    'MetaMask',
    'Spot',
  ];

  const openDefaultWalletConnect = async (id: string) => {
    const c = connectors.filter((c) => c.id === 'walletConnect')[0];
    const connector = new WalletConnectConnector({
      chains: c.chains,
      options: { ...c.options, qrcode: true },
    });

    try {
      await connectAsync(connector);
    } catch (err) {}
  };
  return (
    <PageContent style={{ width: 312 }}>
      <ModalHeadingBlock />
      <ModalContent>
        <WalletList>
          {wallets.map((wallet, i) => (
            <WalletItem key={i}>
              <WalletIcon style={{ background: colors[i % colors.length] }} />
              <WalletLabel>{wallet}</WalletLabel>
            </WalletItem>
          ))}
        </WalletList>
      </ModalContent>
      <Button icon={<ExternalLinkIcon />} onClick={openDefaultWalletConnect}>
        Open Default Modal
      </Button>
    </PageContent>
  );
};

export default MobileConnectors;
