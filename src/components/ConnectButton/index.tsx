import React, { useEffect, useRef, useState } from 'react';
import { useConnect, useAccount, useEnsName, useNetwork } from 'wagmi';
import { truncateEthAddress } from './../../utils';
import { ResetContainer } from '../../styles';

import { Button, IconContainer, TextContainer } from './styles';
import { routes, useContext } from '../ConnectKit';
import Avatar from '../Common/Avatar';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import useMeasure from 'react-use-measure';
import { CustomTheme, Mode, Theme } from '../../types';

const contentVariants: Variants = {
  initial: {
    zIndex: 2,
    opacity: 0,
    x: '-100%',
  },
  animate: {
    opacity: 1,
    x: 0.1,
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: {
    zIndex: 1,
    opacity: 0,
    x: '-100%',
    pointerEvents: 'none',
    position: 'absolute',
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

const addressVariants: Variants = {
  initial: {
    zIndex: 2,
    opacity: 0,
    x: '100%',
  },
  animate: {
    x: 0.1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: {
    zIndex: 1,
    x: '100%',
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

const textVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: {
    position: 'absolute',
    opacity: 0,
    transition: {
      duration: 0.5,
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
        ensName: ensName ?? undefined,
      })}
    </>
  );
};

ConnectButtonRenderer.displayName = 'ConnectKitButton.Custom';

function ConnectKitButtonInner({ onClick }: { onClick: () => void }) {
  const isMounted = useIsMounted();
  // const [address, setAddress] = useState<string>('');
  const { isConnected, isConnecting } = useConnect();

  const [initialRan, setInitialRan] = useState<boolean>(false);
  const { activeChain } = useNetwork();
  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: account?.address,
  });
  const [contentRef, bounds] = useMeasure();

  const connectedSinceBefore = !isConnected && !isConnecting;

  // Done = isConnecting = false
  // Has address = isConnected = false, isConnecting = false
  // Default = isConneted = false, isConnecting = true

  // useEffect(() => {
  //   let timeout;
  //   timeout = setTimeout(() => {
  //     setAddress(account?.address);
  //   }, 1000);

  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [account?.address]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (bounds.width > 100) {
      timeout = setTimeout(() => {
        setInitialRan(true);
      }, 1000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [bounds.width, setInitialRan]);

  if (!isMounted) return null;
  return (
    <Button
      onClick={onClick}
      initial={false}
      animate={{
        width: bounds.width ? bounds.width + 30 : 137,
      }}
      transition={{
        duration: initialRan ? 0.3 : 0,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
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
                key="connectedText"
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

                <div style={{ position: 'relative' }}>
                  <AnimatePresence initial={false}>
                    {ensName ? (
                      <motion.span
                        key="ckEnsName"
                        initial={'initial'}
                        animate={'animate'}
                        exit={'exit'}
                        variants={textVariants}
                      >
                        {ensName}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="ckTruncatedAddress"
                        initial={'initial'}
                        animate={'animate'}
                        exit={'exit'}
                        variants={textVariants}
                      >
                        {truncateEthAddress(account?.address)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </TextContainer>
            ) : (
              <TextContainer
                key="connectWalletText"
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
  );
}

export function ConnectKitButton({
  onClick,
  theme,
  mode,
  customTheme,
}: {
  onClick?: (open: () => void) => void;
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
}) {
  const { isConnected } = useConnect();
  const context = useContext();

  function show() {
    context.setOpen(true);
    context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
  }

  return (
    <ResetContainer
      $useTheme={theme ?? context.theme}
      $useMode={mode ?? context.mode}
      $customTheme={customTheme ?? context.customTheme}
    >
      <ConnectKitButtonInner
        onClick={() => {
          if (onClick) {
            onClick(show);
          } else {
            show();
          }
        }}
      />
    </ResetContainer>
  );
}

// export function ConnectKitButton() {
//   // const isMounted = useIsMounted();
//   const { isConnected } = useConnect();
//   const context = useContext();
//   const containerRef = useRef<any>(null);
//   const [contentRef, bounds] = useMeasure({ offsetSize: true });

//   const { activeChain } = useNetwork();
//   const { data: account } = useAccount();
//   const { data: ensName } = useEnsName({
//     chainId: 1,
//     address: account?.address,
//   });

//   console.log(account, bounds);

//   function hide() {
//     context.setOpen(false);
//   }

//   function show() {
//     context.setOpen(true);
//     context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
//   }

//   // const useIsomorphicLayoutEffect =
//   //   typeof window !== 'undefined' ? useLayoutEffect : useEffect;

//   // const refreshLayout = () => {
//   // if (!containerRef.current || bounds.width === 0) return;
//   //containerRef.current.style.setProperty('--height', `${bounds.height}px`);
//   // containerRef.current.style.setProperty('--width', `${bounds.width}px`);
//   // };
//   // useIsomorphicLayoutEffect(refreshLayout, [bounds.width]);

//   // if (!isMounted) return null;

//   return (
//     <ResetContainer
//       // ref={containerRef}
//       $useTheme={context.theme}
//       $customTheme={context.customTheme}
//       style={{
//         display: 'inline-block',
//         // width: bounds.width === 0 ? 'fit-content' : '100%',
//         // maxWidth:
//         //   bounds.width === 0 ? 'none' : 'calc(var(--width, 107px) + 30px)',
//         // transition: bounds.width
//         //   ? 'width 220ms cubic-bezier(0.25, 1, 0.5, 1)'
//         //   : '',
//       }}
//       initial={false}
//       animate={{
//         width: account?.address ? bounds.width + 30 : 137,
//       }}
//     >
//       <Button onClick={show}>
//         {activeChain?.unsupported ? (
//           <>Wrong network</>
//         ) : (
//           <div
//             ref={contentRef}
//             style={{ width: 'fit-content', position: 'relative' }}
//           >
//             <AnimatePresence initial={false}>
//               {account?.address ? (
//                 <TextContainer
//                   key="connectedText"
//                   initial={'initial'}
//                   animate={'animate'}
//                   exit={'exit'}
//                   variants={addressVariants}
//                   style={{
//                     height: 40,
//                   }}
//                 >
//                   <IconContainer>
//                     <Avatar size={24} address={account?.address} />
//                   </IconContainer>
//                   <span>{ensName ?? truncateEthAddress(account?.address)}</span>
//                 </TextContainer>
//               ) : (
//                 <TextContainer
//                   key="connectWalletText"
//                   initial={'initial'}
//                   animate={'animate'}
//                   exit={'exit'}
//                   variants={contentVariants}
//                   style={{
//                     height: 40,
//                   }}
//                 >
//                   Connect Wallet
//                 </TextContainer>
//               )}
//             </AnimatePresence>
//           </div>
//         )}
//       </Button>
//     </ResetContainer>
//   );
// }

ConnectKitButton.Custom = ConnectButtonRenderer;
