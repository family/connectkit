import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import {
  Container,
  ConnectingContainer,
  ConnectingAnimation,
  RetryButton,
  RetryIconContainer,
  LogoContainer,
  Logo,
  Spinner,
  SpinnerContainer,
  ExpiringSpinner,
  Content,
} from './styles';

import { useContext } from '../../FamilyKit';
import localizations, { localize } from '../../../constants/localizations';
import { useConnect } from 'wagmi';
import supportedConnectors from '../../../constants/supportedConnectors';

import {
  ModalHeading,
  ModalBody,
  ModalH1,
  ModalContentContainer,
  ModalContent,
} from './../../Modal/styles';
import { OrDivider } from './../../Modal';
import Button from './../../Button';
import Tooltip from '../../Tooltip';
import Alert from '../../Alert';

import { Scan } from '../../../assets/icons';
import BrowserIcon from '../../BrowserIcon';
import { AlertIcon, TickIcon, RetryIcon } from '../../../assets/icons';
import { detectBrowser } from '../../../utils';

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
    onBeforeConnect: (connector: any) => {
      setStatus(states.CONNECTING);
    },
    onSettled(data: any, error: any) {
      if (error) {
        if (error.code) {
          switch (error.code) {
            case -32002:
              setStatus(states.NOTCONNECTED);
              break;
            default:
              setStatus(states.FAILED);
              break;
          }
        } else {
          if (error.message === 'User denied account authorization') {
            setStatus(states.REJECTED);
          } else {
            setStatus(states.FAILED);
          }
        }
      } else if (data) {
      }
    },
  });
  const context = useContext();
  const copy = localizations[context.lang].injectionScreen;

  const [id, setId] = useState(connectorId);
  const connector = supportedConnectors.filter((c) => c.id === id)[0];

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

  const localizeText = (text: string) => {
    return localize(text, {
      CONNECTORNAME: connector.name,
      SUGGESTEDEXTENSIONBROWSER: suggestedExtension?.label,
    });
  };

  const runConnect = () => {
    if (!hasExtensionInstalled) return;
    const con = connectors.filter((c) => c.id === id)[0];
    if (con) {
      connect(con);
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

  if (!connector)
    return (
      <Container>
        <ModalHeading>Invalid State</ModalHeading>
        <ModalContent>
          <Alert>
            No connectors match the id given. This state should never happen.
          </Alert>
        </ModalContent>
      </Container>
    );

  // TODO: Make this more generic
  if (connector.id === 'walletConnect')
    return (
      <Container>
        <ModalHeading>Invalid State</ModalHeading>
        <ModalContent>
          <Alert>
            WalletConnect does not have an injection flow. This state should
            never happen.
          </Alert>
        </ModalContent>
      </Container>
    );

  return (
    <Container>
      <ModalHeading>{connector.name}</ModalHeading>
      <ConnectingContainer>
        <ConnectingAnimation
          $shake={status === states.FAILED || status === states.REJECTED}
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
                      status === states.FAILED || status === states.REJECTED
                    }
                    message={'Try connecting again'}
                    xOffset={-6}
                  >
                    <RetryIcon />
                  </Tooltip>
                </RetryIconContainer>
              </RetryButton>
            )}
          </AnimatePresence>
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
            <LogoContainer
              //layoutId="connectorLogo"
              transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 0.98] }}
            >
              <Logo>{connector.logo}</Logo>
              <SpinnerContainer>
                <AnimatePresence>
                  {status === states.CONNECTING && (
                    <Spinner
                      key="Spinner"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{
                        opacity: 0,
                        transition: {
                          duration: status === states.EXPIRING ? 1 : 0,
                        },
                      }}
                    />
                  )}
                  {status === states.EXPIRING && (
                    <ExpiringSpinner
                      key="ExpiringSpinner"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div />
                      <div />
                    </ExpiringSpinner>
                  )}
                </AnimatePresence>
              </SpinnerContainer>
              <svg
                aria-hidden="true"
                width="102"
                height="102"
                viewBox="0 0 102 102"
                fill="none"
              >
                <rect
                  x="7.57895"
                  y="7.57895"
                  width="86.8421"
                  height="86.8421"
                  rx="19.2211"
                  stroke="black"
                  strokeOpacity="0.02"
                  strokeWidth="1.15789"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 0H102V102H0V0ZM7 38.284C7 27.5684 7 22.2106 9.01905 18.0892C10.9522 14.1431 14.1431 10.9522 18.0892 9.01905C22.2106 7 27.5684 7 38.284 7H63.716C74.4316 7 79.7894 7 83.9108 9.01905C87.8569 10.9522 91.0478 14.1431 92.9809 18.0892C95 22.2106 95 27.5684 95 38.284V63.716C95 74.4316 95 79.7894 92.9809 83.9108C91.0478 87.8569 87.8569 91.0478 83.9108 92.9809C79.7894 95 74.4316 95 63.716 95H38.284C27.5684 95 22.2106 95 18.0892 92.9809C14.1431 91.0478 10.9522 87.8569 9.01905 83.9108C7 79.7894 7 74.4316 7 63.716V38.284ZM41.5 0.5H41.4325C34.7246 0.499996 29.6023 0.499994 25.5104 0.823325C21.388 1.14906 18.1839 1.80986 15.3416 3.20227C10.0602 5.78959 5.78959 10.0602 3.20227 15.3416C1.80986 18.1839 1.14906 21.388 0.823325 25.5104C0.499994 29.6023 0.499996 34.7246 0.5 41.4325V41.5V55.5938C0.5 55.6808 0.507407 55.766 0.521624 55.849C0.507407 55.9319 0.5 56.0172 0.5 56.1042V60.5V60.5675C0.499996 67.2754 0.499994 72.3977 0.823325 76.4896C1.14906 80.612 1.80986 83.8161 3.20227 86.6584C5.78959 91.9398 10.0602 96.2104 15.3416 98.7977C18.1839 100.19 21.388 100.851 25.5104 101.177C29.6022 101.5 34.7244 101.5 41.432 101.5H41.4324H41.5H43.4227H60.5H60.5675H60.568C67.2756 101.5 72.3977 101.5 76.4896 101.177C80.612 100.851 83.8161 100.19 86.6584 98.7977C91.9398 96.2104 96.2104 91.9398 98.7977 86.6584C100.19 83.8161 100.851 80.612 101.177 76.4896C101.5 72.3978 101.5 67.2756 101.5 60.568V60.5676V60.5V41.5V41.4324V41.432C101.5 34.7244 101.5 29.6022 101.177 25.5104C100.851 21.388 100.19 18.1839 98.7977 15.3416C96.2104 10.0602 91.9398 5.78959 86.6584 3.20227C83.8161 1.80986 80.612 1.14906 76.4896 0.823325C72.3977 0.499994 67.2754 0.499996 60.5675 0.5H60.5H41.5ZM3.5 56.1042C3.5 56.0172 3.49259 55.9319 3.47838 55.849C3.49259 55.766 3.5 55.6808 3.5 55.5938V41.5C3.5 34.7112 3.50109 29.7068 3.814 25.7467C4.1256 21.8032 4.73946 19.0229 5.89635 16.6614C8.19077 11.9779 11.9779 8.19077 16.6614 5.89635C19.0229 4.73946 21.8032 4.1256 25.7467 3.814C29.7068 3.50109 34.7112 3.5 41.5 3.5H60.5C67.2888 3.5 72.2932 3.50109 76.2533 3.814C80.1968 4.1256 82.977 4.73946 85.3386 5.89635C90.022 8.19077 93.8092 11.9779 96.1036 16.6614C97.2605 19.0229 97.8744 21.8032 98.186 25.7467C98.4989 29.7068 98.5 34.7112 98.5 41.5V60.5C98.5 67.2888 98.4989 72.2932 98.186 76.2533C97.8744 80.1968 97.2605 82.9771 96.1036 85.3386C93.8092 90.022 90.022 93.8092 85.3386 96.1036C82.977 97.2605 80.1968 97.8744 76.2533 98.186C72.2932 98.4989 67.2888 98.5 60.5 98.5H43.4227H41.5C34.7112 98.5 29.7068 98.4989 25.7467 98.186C21.8032 97.8744 19.0229 97.2605 16.6614 96.1036C11.9779 93.8092 8.19077 90.022 5.89635 85.3386C4.73946 82.9771 4.1256 80.1968 3.814 76.2533C3.50109 72.2932 3.5 67.2888 3.5 60.5V56.1042Z"
                  fill="var(--body-background)"
                />
              </svg>
            </LogoContainer>
          </Tooltip>
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
                  {localizeText(copy.failed.h1)}
                </ModalH1>
                <ModalBody>{localizeText(copy.failed.p)}</ModalBody>
              </ModalContent>
              {/* Reason: Coinbase Wallet does not expose a QRURI when extension is installed */}
              {connector.scannable && connector.id !== 'coinbaseWallet' && (
                <>
                  <OrDivider />
                  <Button
                    icon={<Scan />}
                    onClick={() => switchConnectMethod(id)}
                  >
                    Scan the QR code
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
              <ModalContent
                style={connector.scannable ? { paddingBottom: 34 } : {}}
              >
                <ModalH1>{localizeText(copy.rejected.h1)}</ModalH1>
                <ModalBody>{localizeText(copy.rejected.p)}</ModalBody>
              </ModalContent>

              {/* Reason: Coinbase Wallet does not expose a QRURI when extension is installed */}
              {connector.scannable && connector.id !== 'coinbaseWallet' && (
                <>
                  <OrDivider />
                  <Button
                    icon={<Scan />}
                    onClick={() => switchConnectMethod(id)}
                  >
                    Scan the QR code
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
              <ModalContent>
                <ModalH1>{localizeText(copy.connecting.h1)}</ModalH1>
                <ModalBody>{localizeText(copy.connecting.p)}</ModalBody>
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
              <ModalContent style={{ paddingBottom: 18 }}>
                <ModalH1 $valid>
                  <TickIcon /> {localizeText(copy.connected.h1)}
                </ModalH1>
                <ModalBody>{localizeText(copy.connected.p)}</ModalBody>
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
              <ModalContent style={{ paddingBottom: 18 }}>
                <ModalH1>{localizeText(copy.notconnected.h1)}</ModalH1>
                <ModalBody>{localizeText(copy.notconnected.p)}</ModalBody>
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
                  <ModalContent style={{ paddingBottom: 18 }}>
                    <ModalH1>{localizeText(copy.unavailable.h1)}</ModalH1>
                    <ModalBody>{localizeText(copy.unavailable.p)}</ModalBody>
                  </ModalContent>

                  {/**
                  <OrDivider />
                  <Button
                    icon={<Scan />}
                    onClick={() =>
                      switchConnectMethod(
                        !connector.scannable ? 'walletConnect' : id
                      )
                    }
                  >
                    Scan the QR code
                  </Button>
                  */}
                  {!hasExtensionInstalled && suggestedExtension && (
                    <Button
                      href={suggestedExtension?.url}
                      icon={<BrowserIcon browser={suggestedExtension?.name} />}
                    >
                      Install on {suggestedExtension?.label}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <ModalContent style={{ paddingBottom: 18 }}>
                    <ModalH1>{localizeText(copy.install.h1)}</ModalH1>
                    <ModalBody>{localizeText(copy.install.p)}</ModalBody>
                  </ModalContent>
                  {/**
                  {(connector.scannable &&|
                    (!hasExtensionInstalled && extensionUrl)) && <OrDivider />}

                  {connector.scannable && (
                    <Button icon={<Scan />} onClick={switchConnectMethod}>
                      Scan the QR code
                    </Button>
                  )}
                  */}
                  {!hasExtensionInstalled && extensionUrl && (
                    <Button href={extensionUrl} icon={<BrowserIcon />}>
                      Install the Extension
                    </Button>
                  )}
                </>
              )}
            </Content>
          )}
        </AnimatePresence>
      </ModalContentContainer>
    </Container>
  );
};

export default ConnectWithInjector;
