import React from 'react';
import { useConnect, useAccount, useEnsName } from 'wagmi';
import { truncateEthAddress } from './../../utils';
import { ResetContainer } from '../../styles';

import { Button, IconContainer, TextContainer } from './styles';
import { routes, useContext } from '../FamilyKit';
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

type ConnectButtonRendererProps = {
  children?: (renderProps: {
    show?: () => void;
    hide?: () => void;
    isConnected: boolean;
    isConnecting: boolean;
    address?: string;
    truncatedAddress?: string;
    ensName?: string;
  }) => React.ReactNode;
};

const ConnectButtonRenderer: React.FC<ConnectButtonRendererProps> = ({
  children,
}) => {
  const context = useContext();
  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: account?.address,
  });
  const { isConnected, isConnecting } = useConnect();

  function hide() {
    context.setOpen(false);
  }

  function show() {
    context.setOpen(true);
    context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
  }

  if (!children) return null;

  return (
    <>
      {children({
        show,
        hide,
        isConnected: !!(isConnected && account?.address),
        isConnecting: isConnecting,
        address: account?.address ?? '',
        truncatedAddress: account?.address
          ? truncateEthAddress(account?.address)
          : '',
        ensName: ensName ?? '',
      })}
    </>
  );
};

ConnectButtonRenderer.displayName = 'ConnectKitButton.Custom';

export function ConnectKitButton() {
  const context = useContext();
  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: account?.address,
  });
  const { isConnected } = useConnect();

  function hide() {
    context.setOpen(false);
  }

  function show() {
    context.setOpen(true);
    context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
  }

  return (
    <ResetContainer theme={context.theme}>
      <Button onClick={show}>
        <AnimatePresence initial={false}>
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
}

ConnectKitButton.Custom = ConnectButtonRenderer;
