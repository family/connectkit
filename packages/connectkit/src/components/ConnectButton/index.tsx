import React from 'react';
import { useAccount, useEnsName } from 'wagmi';
import { truncateENSAddress, truncateEthAddress } from './../../utils';
import useIsMounted from '../../hooks/useIsMounted';

import {
  IconContainer,
  TextContainer,
  UnsupportedNetworkContainer,
} from './styles';
import { routes, useContext } from '../ConnectKit';
import { useModal } from '../../hooks/useModal';

import Avatar from '../Common/Avatar';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { CustomTheme, Mode, Theme } from '../../types';
import { Balance } from '../BalanceButton';
import ThemedButton, { ThemeContainer } from '../Common/ThemedButton';
import { ResetContainer } from '../../styles';
import { AuthIcon } from '../../assets/icons';
import { useSIWE } from '../../siwe';
import useLocales from '../../hooks/useLocales';
import { Chain } from 'viem';
import { useChainIsSupported } from '../../hooks/useChainIsSupported';
import { useEnsFallbackConfig } from '../../hooks/useEnsFallbackConfig';

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

type Hash = `0x${string}`;

type ConnectButtonRendererProps = {
  children?: (renderProps: {
    show?: () => void;
    hide?: () => void;
    chain?: Chain & {
      unsupported?: boolean;
    };
    unsupported: boolean;
    isConnected: boolean;
    isConnecting: boolean;
    address?: Hash;
    truncatedAddress?: string;
    ensName?: string;
  }) => React.ReactNode;
};

const ConnectButtonRenderer: React.FC<ConnectButtonRendererProps> = ({
  children,
}) => {
  const isMounted = useIsMounted();
  const context = useContext();
  const { open, setOpen } = useModal();

  const { address, isConnected, chain } = useAccount();
  const isChainSupported = useChainIsSupported(chain?.id);

  const ensFallbackConfig = useEnsFallbackConfig();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: address,
    config: ensFallbackConfig,
  });

  function hide() {
    setOpen(false);
  }

  function show() {
    setOpen(true);
    context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
  }

  if (!children) return null;
  if (!isMounted) return null;

  return (
    <>
      {children({
        show,
        hide,
        chain: chain,
        unsupported: !isChainSupported,
        isConnected: !!address,
        isConnecting: open, // Using `open` to determine if connecting as wagmi isConnecting only is set to true when an active connector is awaiting connection
        address: address,
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
  const locales = useLocales({});
  const context = useContext();
  const { isSignedIn } = useSIWE();

  const { address, chain } = useAccount();
  const isChainSupported = useChainIsSupported(chain?.id);

  const ensFallbackConfig = useEnsFallbackConfig();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: address,
    config: ensFallbackConfig,
  });
  const defaultLabel = locales.connectWallet;

  return (
    <AnimatePresence initial={false}>
      {address ? (
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
                {isSignedIn && (
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
                {!isChainSupported && (
                  <UnsupportedNetworkContainer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.68831 13.5H12.0764C13.1026 13.5 13.7647 12.7197 13.7647 11.763C13.7647 11.4781 13.6985 11.1863 13.5462 10.9149L8.34225 1.37526C8.02445 0.791754 7.45505 0.5 6.88566 0.5C6.31627 0.5 5.73364 0.791754 5.42246 1.37526L0.225108 10.9217C0.0728291 11.1863 0 11.4781 0 11.763C0 12.7197 0.662083 13.5 1.68831 13.5ZM6.88566 8.8048C6.49503 8.8048 6.27655 8.5809 6.26331 8.1738L6.16399 5.0595C6.15075 4.64562 6.44869 4.34708 6.87904 4.34708C7.30278 4.34708 7.61396 4.6524 7.60071 5.06628L7.5014 8.16701C7.48154 8.5809 7.26305 8.8048 6.88566 8.8048ZM6.88566 11.3492C6.44207 11.3492 6.07792 11.0303 6.07792 10.5757C6.07792 10.1211 6.44207 9.80219 6.88566 9.80219C7.32926 9.80219 7.69341 10.1143 7.69341 10.5757C7.69341 11.0371 7.32264 11.3492 6.88566 11.3492Z"
                        fill="currentColor"
                      />
                    </svg>
                  </UnsupportedNetworkContainer>
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
          {label ? label : defaultLabel}
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

  const { isConnected, address, chain } = useAccount();
  const chainIsSupported = useChainIsSupported(chain?.id);

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

  const shouldShowBalance = showBalance && chainIsSupported;
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
