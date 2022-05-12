import React from 'react';
import { useConnect, useAccount, useEnsName } from 'wagmi';
import { truncateEthAddress } from './../../utils';
import { ResetContainer } from '../../styles';

import { Button, IconContainer, TextContainer } from './styles';
import { useContext } from '../FamilyKit';
import Avatar from '../Avatar';
import { AnimatePresence, Variants } from 'framer-motion';

const contentVariants: Variants = {
  initial: {
    //willChange: 'transform,opacity',
    zIndex: 2,
    opacity: 0,
    y: -10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.15,
      delay: 0.1,
    },
  },
  exit: {
    zIndex: 1,
    opacity: 0,
    y: 10,
    pointerEvents: 'none',
    position: 'absolute',
    transition: { duration: 0.2 },
  },
};

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
        <AnimatePresence>
          {isConnected && account?.address ? (
            <TextContainer
              key="connected"
              initial={'initial'}
              animate={'animate'}
              exit={'exit'}
              variants={contentVariants}
            >
              <IconContainer>
                <Avatar size={24} address={account?.address} />
              </IconContainer>
              <span>{ensName ?? truncateEthAddress(account?.address)}</span>
            </TextContainer>
          ) : (
            <TextContainer
              key="connect"
              initial={'initial'}
              animate={'animate'}
              exit={'exit'}
              variants={contentVariants}
            >
              Connect Wallet
            </TextContainer>
          )}
        </AnimatePresence>
      </Button>
    </ResetContainer>
  );
};

export default ConnectButton;
