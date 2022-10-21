import React from 'react';
import { useAccount, useEnsName, useNetwork } from 'wagmi';
import { truncateENSAddress, truncateEthAddress } from './../../utils';
import useIsMounted from '../../hooks/useIsMounted';

import { IconContainer, TextContainer } from './styles';
import { routes, useContext } from '../ConnectKit';
import Avatar from '../Common/Avatar';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { CustomTheme, Mode, Theme } from '../../types';
import { Balance } from '../BalanceButton';
import ThemedButton, { ThemeContainer } from '../Common/ThemedButton';
import { ResetContainer } from '../../styles';
import { AuthIcon } from '../../assets/icons';
import { useSIWE } from '../Standard/SIWE/useSIWE';

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
      duration: 0.4,
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
      duration: 0.4,
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
    x: 0.2,
    opacity: 1,
    transition: {
      duration: 0.4,
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
      duration: 0.4,
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
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: {
    position: 'absolute',
    opacity: 0,
    transition: {
      duration: 0.3,
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

const ConnectButtonRenderer: React.FC<ConnectButtonRendererProps> = ({
  children,
}) => {
  const isMounted = useIsMounted();
  const context = useContext();

  const { chain } = useNetwork();
  const { address, isConnected, isConnecting } = useAccount();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: address,
  });

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
        unsupported: !!chain?.unsupported,
        isConnected: !!address,
        isConnecting: isConnecting,
        address: address?.toString(),
        truncatedAddress: address ? truncateEthAddress(address) : undefined,
        ensName: ensName?.toString(),
      })}
    </>
  );
};

ConnectButtonRenderer.displayName = 'ConnectKitButton.Custom';

function ConnectKitButtonInner({
  label,
  showAvatar,
  separator,
}: {
  label?: string;
  showAvatar?: boolean;
  separator?: string;
}) {
  const context = useContext();
  const { signedIn } = useSIWE();

  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: address,
  });

  return (
    <AnimatePresence initial={false}>
      {chain?.unsupported ? (
        <TextContainer
          key="unsupported-chain"
          initial={'initial'}
          animate={'animate'}
          exit={'exit'}
          variants={textVariants}
          style={{
            height: 40,
            //padding: '0 5px',
          }}
        >
          Wrong network
        </TextContainer>
      ) : address ? (
        <TextContainer
          key="connectedText"
          initial={'initial'}
          animate={'animate'}
          exit={'exit'}
          variants={addressVariants}
          style={{
            height: 40,
            //padding: !showAvatar ? '0 5px' : undefined,
          }}
        >
          {showAvatar && (
            <IconContainer>
              <AnimatePresence initial={false}>
                {signedIn && (
                  <motion.div
                    style={{
                      zIndex: 2,
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AuthIcon />
                  </motion.div>
                )}
              </AnimatePresence>
              <Avatar size={24} address={address} />
            </IconContainer>
          )}

          <div
            style={{
              position: 'relative',
              paddingRight: showAvatar ? 1 : 0,
            }}
          >
            <AnimatePresence initial={false}>
              {ensName ? (
                <TextContainer
                  key="ckEnsName"
                  initial={'initial'}
                  animate={'animate'}
                  exit={'exit'}
                  variants={textVariants}
                  style={{
                    position: ensName ? 'relative' : 'absolute',
                  }}
                >
                  {context.options?.truncateLongENSAddress
                    ? truncateENSAddress(ensName, 20)
                    : ensName}
                </TextContainer>
              ) : (
                <TextContainer
                  key="ckTruncatedAddress"
                  initial={'initial'}
                  animate={'animate'}
                  exit={'exit'}
                  variants={textVariants}
                  style={{
                    position: ensName ? 'absolute' : 'relative',
                  }}
                >
                  {truncateEthAddress(address, separator)}{' '}
                </TextContainer>
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
            //padding: '0 5px',
          }}
        >
          {label ? label : <>Connect Wallet</>}
        </TextContainer>
      )}
    </AnimatePresence>
  );
}

type ConnectKitButtonProps = {
  // Options
  label?: string;
  showBalance?: boolean;
  showAvatar?: boolean;

  // Theming
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;

  // Events
  onClick?: (open: () => void) => void;
};

export function ConnectKitButton({
  // Options
  label,
  showBalance = false,
  showAvatar = true,

  // Theming
  theme,
  mode,
  customTheme,

  // Events
  onClick,
}: ConnectKitButtonProps) {
  const isMounted = useIsMounted();

  const context = useContext();

  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();

  function show() {
    context.setOpen(true);
    context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
  }

  const separator = ['web95', 'rounded', 'minimal'].includes(
    theme ?? context.theme ?? ''
  )
    ? '....'
    : undefined;

  if (!isMounted) return null;

  const shouldShowBalance = showBalance && !chain?.unsupported;
  const willShowBalance = address && shouldShowBalance;

  return (
    <ResetContainer
      $useTheme={theme ?? context.theme}
      $useMode={mode ?? context.mode}
      $customTheme={customTheme ?? context.customTheme}
    >
      <ThemeContainer
        onClick={() => {
          if (onClick) {
            onClick(show);
          } else {
            show();
          }
        }}
      >
        {shouldShowBalance && (
          <AnimatePresence initial={false}>
            {willShowBalance && (
              <motion.div
                key={'balance'}
                initial={{
                  opacity: 0,
                  x: '100%',
                  width: 0,
                  marginRight: 0,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  width: 'auto',
                  marginRight: -24,
                  transition: {
                    duration: 0.4,
                    ease: [0.25, 1, 0.5, 1],
                  },
                }}
                exit={{
                  opacity: 0,
                  x: '100%',
                  width: 0,
                  marginRight: 0,
                  transition: {
                    duration: 0.4,
                    ease: [0.25, 1, 0.5, 1],
                  },
                }}
              >
                <ThemedButton
                  variant={'secondary'}
                  theme={theme ?? context.theme}
                  mode={mode ?? context.mode}
                  customTheme={customTheme ?? context.customTheme}
                  style={{ overflow: 'hidden' }}
                >
                  <motion.div style={{ paddingRight: 24 }}>
                    <Balance hideSymbol />
                  </motion.div>
                </ThemedButton>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <ThemedButton
          theme={theme ?? context.theme}
          mode={mode ?? context.mode}
          customTheme={customTheme ?? context.customTheme}
          style={
            shouldShowBalance &&
            showBalance &&
            address &&
            (theme === 'retro' || context.theme === 'retro')
              ? {
                  /** Special fix for the retro theme... not happy about this one */
                  boxShadow:
                    'var(--ck-connectbutton-balance-connectbutton-box-shadow)',
                  borderRadius:
                    'var(--ck-connectbutton-balance-connectbutton-border-radius)',
                  overflow: 'hidden',
                }
              : {
                  overflow: 'hidden',
                }
          }
        >
          <ConnectKitButtonInner
            separator={separator}
            showAvatar={showAvatar}
            label={label}
          />
        </ThemedButton>
      </ThemeContainer>
    </ResetContainer>
  );
}

ConnectKitButton.Custom = ConnectButtonRenderer;
