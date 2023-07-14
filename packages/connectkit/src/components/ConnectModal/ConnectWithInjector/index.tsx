import React, { useEffect, useState } from 'react';
import { AnimatePresence, Variants } from 'framer-motion';
import {
  Container,
  ConnectingContainer,
  ConnectingAnimation,
  RetryButton,
  RetryIconContainer,
  Content,
} from './styles';

import supportedConnectors from '../../../constants/supportedConnectors';

import {
  PageContent,
  ModalHeading,
  ModalBody,
  ModalH1,
  ModalContentContainer,
  ModalContent,
} from '../../Common/Modal/styles';
import { OrDivider } from '../../Common/Modal';
import Button from '../../Common/Button';
import Tooltip from '../../Common/Tooltip';
import Alert from '../../Common/Alert';

import CircleSpinner from './CircleSpinner';

import { RetryIconCircle, Scan } from '../../../assets/icons';
import BrowserIcon from '../../Common/BrowserIcon';
import { AlertIcon, TickIcon } from '../../../assets/icons';
import {
  detectBrowser,
  isInjectedConnector,
  isWalletConnectConnector,
} from '../../../utils';
import useLocales from '../../../hooks/useLocales';
import { useConnect } from '../../../hooks/useConnect';
import useDefaultWallets from '../../../wallets/useDefaultWallets';

export const states = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  EXPIRING: 'expiring',
  FAILED: 'failed',
  REJECTED: 'rejected',
  NOTCONNECTED: 'notconnected',
  UNAVAILABLE: 'unavailable',
};

const contentVariants: Variants = {
  initial: {
    willChange: 'transform,opacity',
    position: 'relative',
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    position: 'relative',
    opacity: 1,
    scale: 1,
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.4,
      delay: 0.05,
      position: { delay: 0 },
    },
  },
  exit: {
    position: 'absolute',
    opacity: 0,
    scale: 0.95,
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.3,
    },
  },
};

const ConnectWithInjector: React.FC<{
  connectorId: string;
  switchConnectMethod: (id?: string) => void;
  forceState?: typeof states;
}> = ({ connectorId, switchConnectMethod, forceState }) => {
  const { connect, connectors } = useConnect({
    onMutate: (connector?: any) => {
      if (connector.connector) {
        setStatus(states.CONNECTING);
      } else {
        setStatus(states.UNAVAILABLE);
      }
    },
    onError(err?: any) {
      console.error(err);
    },
    onSettled(data?: any, error?: any) {
      if (error) {
        setShowTryAgainTooltip(true);
        setTimeout(() => setShowTryAgainTooltip(false), 3500);
        if (error.code) {
          // https://github.com/MetaMask/eth-rpc-errors/blob/main/src/error-constants.ts
          switch (error.code) {
            case -32002:
              setStatus(states.NOTCONNECTED);
              break;
            case 4001:
              setStatus(states.REJECTED);
              break;
            default:
              setStatus(states.FAILED);
              break;
          }
        } else {
          // Sometimes the error doesn't respond with a code
          if (error.message) {
            switch (error.message) {
              case 'User rejected request':
                setStatus(states.REJECTED);
                break;
              default:
                setStatus(states.FAILED);
                break;
            }
          }
        }
      } else if (data) {
      }
    },
  });

  const [id, setId] = useState(connectorId);
  const [showTryAgainTooltip, setShowTryAgainTooltip] = useState(false);
  const wallets = useDefaultWallets();
  const installedWallets = wallets.filter((wallet) => wallet.installed);
  let connector = supportedConnectors.filter((c) => c.id === id)[0];
  if (isInjectedConnector(connectorId) && installedWallets.length > 0) {
    const wallet = installedWallets[0];
    connector = {
      ...wallet,
      extensionIsInstalled: () => {
        return wallet?.installed;
      },
      extensions: {
        ...wallet?.downloadUrls,
      },
      appUrls: {
        ...wallet?.downloadUrls,
      },
    };
  }

  console.log('connector', connector);

  const expiryDefault = 9; // Starting at 10 causes layout shifting, better to start at 9
  const [expiryTimer, setExpiryTimer] = useState<number>(expiryDefault);

  const hasExtensionInstalled =
    connector.extensionIsInstalled && connector.extensionIsInstalled();

  const browser = detectBrowser();
  const extensionUrl = connector.extensions
    ? connector.extensions[browser]
    : undefined;

  const suggestedExtension = connector.extensions
    ? {
        name: Object.keys(connector.extensions)[0],
        label:
          Object.keys(connector.extensions)[0].charAt(0).toUpperCase() +
          Object.keys(connector.extensions)[0].slice(1), // Capitalise first letter, but this might be better suited as a lookup table
        url: connector.extensions[Object.keys(connector.extensions)[0]],
      }
    : undefined;

  const [status, setStatus] = useState(
    forceState
      ? forceState
      : !hasExtensionInstalled
      ? states.UNAVAILABLE
      : states.CONNECTING
  );

  const locales = useLocales({
    CONNECTORNAME: connector.name,
    CONNECTORSHORTNAME: connector.shortName ?? connector.name,
    SUGGESTEDEXTENSIONBROWSER: suggestedExtension?.label ?? 'your browser',
  });

  const runConnect = () => {
    if (!hasExtensionInstalled) return;

    const con: any = connectors.find((c) => c.id === id);
    if (con) {
      connect({ connector: con });
    } else {
      setStatus(states.UNAVAILABLE);
    }
  };

  let connectTimeout: any;
  useEffect(() => {
    if (status === states.UNAVAILABLE) return;

    // UX: Give user time to see the UI before opening the extension
    connectTimeout = setTimeout(runConnect, 600);
    return () => {
      clearTimeout(connectTimeout);
    };
  }, []);

  /** Timeout functionality if necessary
  let expiryTimeout: any;
  useEffect(() => {
    if (status === states.EXPIRING) {
      expiryTimeout = setTimeout(
        () => {
          if (expiryTimer <= 0) {
            setStatus(states.FAILED);
            setExpiryTimer(expiryDefault);
          } else {
            setExpiryTimer(expiryTimer - 1);
          }
        },
        expiryTimer === 9 ? 1500 : 1000 // Google: Chronostasis
      );
    }
    return () => {
      clearTimeout(expiryTimeout);
    };
  }, [status, expiryTimer]);
  */

  if (!connector) {
    return (
      <PageContent>
        <Container>
          <ModalHeading>Invalid State</ModalHeading>
          <ModalContent>
            <Alert>
              No connectors match the id given. This state should never happen.
            </Alert>
          </ModalContent>
        </Container>
      </PageContent>
    );
  }

  // TODO: Make this more generic
  if (isWalletConnectConnector(connector?.id)) {
    return (
      <PageContent>
        <Container>
          <ModalHeading>Invalid State</ModalHeading>
          <ModalContent>
            <Alert>
              WalletConnect does not have an injection flow. This state should
              never happen.
            </Alert>
          </ModalContent>
        </Container>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <Container>
        <ConnectingContainer>
          <ConnectingAnimation
            $shake={status === states.FAILED || status === states.REJECTED}
            $circle
          >
            <AnimatePresence>
              {(status === states.FAILED || status === states.REJECTED) && (
                <RetryButton
                  aria-label="Retry"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                  onClick={runConnect}
                >
                  <RetryIconContainer>
                    <Tooltip
                      open={
                        showTryAgainTooltip &&
                        (status === states.FAILED || status === states.REJECTED)
                      }
                      message={locales.tryAgainQuestion}
                      xOffset={-6}
                    >
                      <RetryIconCircle />
                    </Tooltip>
                  </RetryIconContainer>
                </RetryButton>
              )}
            </AnimatePresence>

            {/*
            <Tooltip
              open={status === states.EXPIRING}
              message={
                <span
                  style={{
                    display: 'block',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copy.expiring.requestWillExpiryIn}{' '}
                  <span style={{ position: 'relative' }}>
                    <AnimatePresence>
                      <motion.span
                        key={expiryTimer}
                        style={{
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                        initial={{
                          willChange: 'transform,opacity',
                          position: 'relative',
                          opacity: 0,
                          scale: 0.5,
                          y: 0,
                        }}
                        animate={{
                          position: 'relative',
                          opacity: 1,
                          scale: 1,
                          y: 0,
                          transition: {
                            ease: 'easeOut',
                            duration: 0.2,
                            delay: 0.2,
                          },
                        }}
                        exit={{
                          position: 'absolute',
                          opacity: 0,
                          scale: 0.5,
                          y: 0,
                          transition: {
                            ease: 'easeIn',
                            duration: 0.2,
                          },
                        }}
                      >
                        {expiryTimer}
                      </motion.span>
                    </AnimatePresence>
                    s
                  </span>
                </span>
              }
              xOffset={-2}
            >
            */}
            <CircleSpinner
              logo={
                status === states.UNAVAILABLE ? (
                  <div
                    style={{
                      transform: 'scale(1.14)',
                      position: 'relative',
                      width: '100%',
                    }}
                  >
                    {connector.logos.transparent ?? connector.logos.default}
                  </div>
                ) : (
                  <>{connector.logos.transparent ?? connector.logos.default}</>
                )
              }
              smallLogo={connector.id === 'injected'}
              connecting={status === states.CONNECTING}
              unavailable={status === states.UNAVAILABLE}
              countdown={status === states.EXPIRING}
            />
            {/* </Tooltip> */}
          </ConnectingAnimation>
        </ConnectingContainer>
        <ModalContentContainer>
          <AnimatePresence initial={false}>
            {status === states.FAILED && (
              <Content
                key={states.FAILED}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                <ModalContent>
                  <ModalH1 $error>
                    <AlertIcon />
                    {locales.injectionScreen_failed_h1}
                  </ModalH1>
                  <ModalBody>{locales.injectionScreen_failed_p}</ModalBody>
                </ModalContent>
                {/* Reason: Coinbase Wallet does not expose a QRURI when extension is installed */}
                {connector.scannable && connector.id !== 'coinbaseWallet' && (
                  <>
                    <OrDivider />
                    <Button
                      icon={<Scan />}
                      onClick={() => switchConnectMethod(id)}
                    >
                      {locales.scanTheQRCode}
                    </Button>
                  </>
                )}
              </Content>
            )}
            {status === states.REJECTED && (
              <Content
                key={states.REJECTED}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                <ModalContent style={{ paddingBottom: 28 }}>
                  <ModalH1>{locales.injectionScreen_rejected_h1}</ModalH1>
                  <ModalBody>{locales.injectionScreen_rejected_p}</ModalBody>
                </ModalContent>

                {/* Reason: Coinbase Wallet does not expose a QRURI when extension is installed */}
                {connector.scannable && connector.id !== 'coinbaseWallet' && (
                  <>
                    <OrDivider />
                    <Button
                      icon={<Scan />}
                      onClick={() => switchConnectMethod(id)}
                    >
                      {locales.scanTheQRCode}
                    </Button>
                  </>
                )}
              </Content>
            )}
            {(status === states.CONNECTING || status === states.EXPIRING) && (
              <Content
                key={states.CONNECTING}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                <ModalContent style={{ paddingBottom: 28 }}>
                  <ModalH1>
                    {connector.id === 'injected'
                      ? locales.injectionScreen_connecting_injected_h1
                      : locales.injectionScreen_connecting_h1}
                  </ModalH1>
                  <ModalBody>
                    {connector.id === 'injected'
                      ? locales.injectionScreen_connecting_injected_p
                      : locales.injectionScreen_connecting_p}
                  </ModalBody>
                </ModalContent>
              </Content>
            )}
            {status === states.CONNECTED && (
              <Content
                key={states.CONNECTED}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                <ModalContent>
                  <ModalH1 $valid>
                    <TickIcon /> {locales.injectionScreen_connected_h1}
                  </ModalH1>
                  <ModalBody>{locales.injectionScreen_connected_p}</ModalBody>
                </ModalContent>
              </Content>
            )}
            {status === states.NOTCONNECTED && (
              <Content
                key={states.NOTCONNECTED}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                <ModalContent>
                  <ModalH1>{locales.injectionScreen_notconnected_h1}</ModalH1>
                  <ModalBody>
                    {locales.injectionScreen_notconnected_p}
                  </ModalBody>
                </ModalContent>
              </Content>
            )}
            {status === states.UNAVAILABLE && (
              <Content
                key={states.UNAVAILABLE}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                {!extensionUrl ? (
                  <>
                    <ModalContent style={{ paddingBottom: 12 }}>
                      <ModalH1>
                        {locales.injectionScreen_unavailable_h1}
                      </ModalH1>
                      <ModalBody>
                        {locales.injectionScreen_unavailable_p}
                      </ModalBody>
                    </ModalContent>

                    {!hasExtensionInstalled && suggestedExtension && (
                      <Button
                        href={suggestedExtension?.url}
                        icon={
                          <BrowserIcon browser={suggestedExtension?.name} />
                        }
                      >
                        Install on {suggestedExtension?.label}
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <ModalContent style={{ paddingBottom: 18 }}>
                      <ModalH1>{locales.injectionScreen_install_h1}</ModalH1>
                      <ModalBody>{locales.injectionScreen_install_p}</ModalBody>
                    </ModalContent>
                    {/**
                  {(connector.scannable &&|
                    (!hasExtensionInstalled && extensionUrl)) && <OrDivider />}

                  {connector.scannable && (
                    <Button icon={<Scan />} onClick={switchConnectMethod}>
                      {locales.scanTheQRCode}
                    </Button>
                  )}
                  */}
                    {!hasExtensionInstalled && extensionUrl && (
                      <Button href={extensionUrl} icon={<BrowserIcon />}>
                        {locales.installTheExtension}
                      </Button>
                    )}
                  </>
                )}
              </Content>
            )}
          </AnimatePresence>
        </ModalContentContainer>
      </Container>
    </PageContent>
  );
};

export default ConnectWithInjector;
