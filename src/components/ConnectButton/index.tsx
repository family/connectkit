import React, { useEffect, useLayoutEffect, useRef } from 'react';
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
    //willChange: 'transform,opacity',
    zIndex: 2,
    opacity: 0,
    x: '-100%',
    // y: -4,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: {
    zIndex: 1,
    opacity: 0,
    // y: 4,
    x: '-100%',
    pointerEvents: 'none',
    position: 'absolute',
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

const addressVariants: Variants = {
  initial: {
    //willChange: 'transform,opacity',
    zIndex: 2,
    opacity: 0,
    x: '100%',
    // y: -4,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: {
    zIndex: 1,
    opacity: 0,
    // y: 4,
    x: '100%',
    pointerEvents: 'none',
    position: 'absolute',
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
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

  const { activeChain } = useNetwork();
  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: account?.address.toLowerCase(),
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
    containerRef.current.style.setProperty('--width', `${bounds.width}px`);
  };
  useIsomorphicLayoutEffect(refreshLayout, [bounds]);

  if (!isMounted) return null;

  return (
    <ResetContainer
      $useTheme={context.theme}
      $customTheme={context.customTheme}
      ref={containerRef}
      style={{
        display: 'inline-block',
        width: bounds.width === 0 ? 'fit-content' : '100%',
        maxWidth:
          bounds.width === 0 ? 'none' : 'calc(var(--width, 107px) + 30px)',
        transition: 'max-width 220ms cubic-bezier(0.25, 1, 0.5, 1)',
      }}
    >
      <Button onClick={show}>
        {activeChain?.unsupported ? (
          <>Wrong network</>
        ) : (
          <div
            ref={contentRef}
            style={{ width: 'fit-content', position: 'relative' }}
          >
            <AnimatePresence initial={false}>
              {account?.address ? (
                <TextContainer
                  key="connected"
                  initial={'initial'}
                  animate={'animate'}
                  exit={'exit'}
                  variants={addressVariants}
                  style={{
                    height: 40,
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
                  style={{
                    height: 40,
                  }}
                >
                  Connect Wallet
                </TextContainer>
              )}
            </AnimatePresence>
          </div>
        )}
      </Button>
    </ResetContainer>
  );
}

ConnectKitButton.Custom = ConnectButtonRenderer;
