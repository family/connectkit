import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useConnect, useAccount, useEnsName, useNetwork } from 'wagmi';
import { truncateEthAddress } from './../../utils';
import { ResetContainer } from '../../styles';

import { Button, IconContainer, TextContainer } from './styles';
import { routes, useContext } from '../ConnectKit';
import Avatar from '../Common/Avatar';
import { AnimatePresence, Variants } from 'framer-motion';
import useMeasure from 'react-use-measure';

const contentVariants: Variants = {
  initial: {
    zIndex: 2,
    opacity: 0,
    // scale: 1.1,
    x: 0.1,
    transition: {
      duration: 0,
    },
  },
  animate: {
    opacity: 1,
    y: 0,
    // scale: 1,
    x: 0.1,
  },
  exit: {
    zIndex: 1,
    opacity: 0,
    // scale: 1.1,
    x: 0.1,
    pointerEvents: 'none',
    position: 'absolute',
  },
};

const addressVariants: Variants = {
  initial: {
    zIndex: 2,
    opacity: 0,
    // scale: 0.8,
    x: 0.1,
  },
  animate: {
    opacity: 1,
    y: 0,
    // scale: 1,
    x: 0.1,
  },
  exit: {
    zIndex: 1,
    opacity: 0,
    // scale: 0.8,
    x: 0.1,
    pointerEvents: 'none',
    position: 'absolute',
  },
};

type ConnectButtonRendererProps = {
  children?: (renderProps: {
    show?: () => void;
    hide?: () => void;
    unsupported: boolean;
    isConnected: boolean;
    isConnecting: boolean;
    address?: string;
    truncatedAddress?: string;
    ensName?: string;
  }) => React.ReactNode;
};

export const useIsMounted = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
};

const ConnectButtonRenderer: React.FC<ConnectButtonRendererProps> = ({
  children,
}) => {
  const isMounted = useIsMounted();
  const context = useContext();
  const { activeChain } = useNetwork();
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
  if (!isMounted) return null;

  return (
    <>
      {children({
        show,
        hide,
        unsupported: !!activeChain?.unsupported,
        isConnected: !!account?.address,
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
  const isMounted = useIsMounted();
  const context = useContext();
  const containerRef = useRef<any>(null);
  const [contentRef, bounds] = useMeasure({ offsetSize: true });
  const [width, setWidth] = useState<number>(0);
  const [isInitial, setIsInitial] = useState<boolean>(true);

  const { activeChain } = useNetwork();
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

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  const refreshLayout = () => {
    if (!containerRef.current || bounds.width === 0) return;
    //containerRef.current.style.setProperty('--height', `${bounds.height}px`);
    // containerRef.current.style.setProperty('--width', `${bounds.width}px`);
    setWidth(bounds.width);
    setTimeout(() => {
      setIsInitial(false);
    }, 0);
  };
  useIsomorphicLayoutEffect(refreshLayout, [bounds]);

  if (!isMounted) return null;

  return (
    <ResetContainer
      $useTheme={context.theme}
      $customTheme={context.customTheme}
      ref={containerRef}
      initial={false}
      style={{
        // display: 'inline-block',
        // width: 300,
        // width: bounds.width === 0 ? 'fit-content' : width < 107 ? 107 : width,

        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      animate={{
        width: width < 107 ? 137 : width + 30,
        // maxWidth:
        // bounds.width === 0 ? 'none' : 'calc(var(--width, 107px) + 30px)',
        // maxWidth: bounds.width === 0 ? '100%' : (width || 107) + 30,
      }}
      transition={{
        ease: [0.25, 1, 0.5, 1],
        duration: isInitial ? 0 : 0.15,
      }}
    >
      <Button
        initial={false}
        onClick={show}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatePresence initial={false}>
          {activeChain?.unsupported ? (
            <>Wrong network</>
          ) : (
            <div
              ref={contentRef}
              style={{
                width: 'fit-content',
              }}
            >
              {account?.address ? (
                <TextContainer
                  key="connected"
                  initial={'initial'}
                  animate={'animate'}
                  exit={'exit'}
                  variants={addressVariants}
                  transition={{
                    ease: [0.25, 1, 0.5, 1],
                    duration: isInitial ? 0 : 0.22,
                  }}
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
                  transition={{
                    ease: [0.25, 1, 0.5, 1],
                    duration: isInitial ? 0 : 0.22,
                  }}
                >
                  Connect Wallet
                </TextContainer>
              )}
            </div>
          )}
        </AnimatePresence>
      </Button>
    </ResetContainer>
  );
}

ConnectKitButton.Custom = ConnectButtonRenderer;
