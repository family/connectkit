import React from 'react';
import { useConnect, useAccount, useEnsName } from 'wagmi';
import { truncateEthAddress } from './../../utils';
import { ResetContainer } from '../../styles';

import { Button, IconContainer } from './styles';
import { useContext } from '../FamilyKit';
import Avatar from '../Avatar';

type ConnectButtonProps = {
  onClick?: (e: any) => void;
};

const ConnectButton: React.FC<ConnectButtonProps> = ({ onClick }) => {
  const context = useContext();
  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: account?.address,
  });
  const { isConnected } = useConnect();

  return (
    <ResetContainer theme={context.theme}>
      <Button onClick={onClick}>
        {isConnected && account?.address && (
          <IconContainer>
            <Avatar size={24} address={account?.address} />
          </IconContainer>
        )}

        {isConnected && account?.address ? (
          <span>{ensName ?? truncateEthAddress(account?.address)}</span>
        ) : (
          <span>Connect Wallet</span>
        )}
      </Button>
    </ResetContainer>
  );
};

export default ConnectButton;
