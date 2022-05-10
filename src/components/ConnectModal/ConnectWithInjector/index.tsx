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

const AlertIcon = ({ ...props }) => {
  return (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" {...props}>
      <path
        d="M2.20779 17H15.7922C17.1342 17 18 15.9796 18 14.7286C18 14.356 17.9134 13.9744 17.7143 13.6195L10.9091 1.14457C10.4935 0.381524 9.74892 0 9.00433 0C8.25974 0 7.49784 0.381524 7.09091 1.14457L0.294372 13.6284C0.0952381 13.9744 0 14.356 0 14.7286C0 15.9796 0.865801 17 2.20779 17ZM9.00433 10.8601C8.49351 10.8601 8.20779 10.5673 8.19048 10.035L8.06061 5.96242C8.04329 5.42119 8.4329 5.03079 8.99567 5.03079C9.54978 5.03079 9.95671 5.43006 9.93939 5.97129L9.80952 10.0261C9.78355 10.5673 9.49784 10.8601 9.00433 10.8601ZM9.00433 14.1874C8.42424 14.1874 7.94805 13.7704 7.94805 13.1759C7.94805 12.5814 8.42424 12.1644 9.00433 12.1644C9.58442 12.1644 10.0606 12.5725 10.0606 13.1759C10.0606 13.7792 9.57576 14.1874 9.00433 14.1874Z"
        fill="currentColor"
      />
    </svg>
  );
};

const DisconnectIcon = ({ ...props }) => {
  return (
    <svg
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 0C1.79086 0 0 1.79086 0 4V10C0 12.2091 1.79086 14 4 14H6C6.55228 14 7 13.5523 7 13C7 12.4477 6.55228 12 6 12H4C2.89543 12 2 11.1046 2 10V4C2 2.89543 2.89543 2 4 2H6C6.55228 2 7 1.55228 7 1C7 0.447715 6.55228 0 6 0H4ZM11.7071 3.29289C11.3166 2.90237 10.6834 2.90237 10.2929 3.29289C9.90237 3.68342 9.90237 4.31658 10.2929 4.70711L11.5858 6H9.5H6C5.44772 6 5 6.44772 5 7C5 7.55228 5.44772 8 6 8H9.5H11.5858L10.2929 9.29289C9.90237 9.68342 9.90237 10.3166 10.2929 10.7071C10.6834 11.0976 11.3166 11.0976 11.7071 10.7071L14.7071 7.70711C15.0976 7.31658 15.0976 6.68342 14.7071 6.29289L11.7071 3.29289Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
};

const TickIcon = ({ ...props }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM13.274 7.13324C13.6237 6.70579 13.5607 6.07577 13.1332 5.72604C12.7058 5.37632 12.0758 5.43932 11.726 5.86676L7.92576 10.5115L6.20711 8.79289C5.81658 8.40237 5.18342 8.40237 4.79289 8.79289C4.40237 9.18342 4.40237 9.81658 4.79289 10.2071L7.29289 12.7071C7.49267 12.9069 7.76764 13.0128 8.04981 12.9988C8.33199 12.9847 8.59505 12.8519 8.77396 12.6332L13.274 7.13324Z"
        fill="currentColor"
      />
    </svg>
  );
};

const RetryIcon = ({ ...props }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16ZM24.5001 8.74263C25.0834 8.74263 25.5563 9.21551 25.5563 9.79883V14.5997C25.5563 15.183 25.0834 15.6559 24.5001 15.6559H19.6992C19.1159 15.6559 18.643 15.183 18.643 14.5997C18.643 14.0164 19.1159 13.5435 19.6992 13.5435H21.8378L20.071 11.8798C20.0632 11.8724 20.0555 11.865 20.048 11.8574C19.1061 10.915 17.8835 10.3042 16.5643 10.1171C15.2452 9.92999 13.9009 10.1767 12.7341 10.82C11.5674 11.4634 10.6413 12.4685 10.0955 13.684C9.54968 14.8994 9.41368 16.2593 9.70801 17.5588C10.0023 18.8583 10.711 20.0269 11.7273 20.8885C12.7436 21.7502 14.0124 22.2582 15.3425 22.336C16.6726 22.4138 17.9919 22.0572 19.1017 21.3199C19.5088 21.0495 19.8795 20.7333 20.2078 20.3793C20.6043 19.9515 21.2726 19.9262 21.7004 20.3228C22.1282 20.7194 22.1534 21.3876 21.7569 21.8154C21.3158 22.2912 20.8176 22.7161 20.2706 23.0795C18.7793 24.0702 17.0064 24.5493 15.2191 24.4448C13.4318 24.3402 11.7268 23.6576 10.3612 22.4998C8.9956 21.3419 8.0433 19.7716 7.6478 18.0254C7.2523 16.2793 7.43504 14.4519 8.16848 12.8186C8.90192 11.1854 10.1463 9.83471 11.7142 8.97021C13.282 8.10572 15.0884 7.77421 16.861 8.02565C18.6282 8.27631 20.2664 9.09278 21.5304 10.3525L23.4439 12.1544V9.79883C23.4439 9.21551 23.9168 8.74263 24.5001 8.74263Z"
        fill="currentColor"
      />
    </svg>
  );
};

const ConnectWithInjector: React.FC<{
  connectorId: string;
  switchConnectMethod: (id?: string) => void;
  forceState?: typeof states;
}> = ({ connectorId, switchConnectMethod, forceState }) => {
  const { connect, connectors } = useConnect({
    onBeforeConnect: (connector: any) => {
      setStatus(states.CONNECTING);
      console.log('onBeforeConnect', connector);
    },
    onSettled(data, error) {
      if (error) {
        // TODO: Proper error handling
        if (
          error.message === 'User denied account authorization' || // coinbaseWallet
          error.message === 'User rejected request' // metaMask
        ) {
          setStatus(states.REJECTED);
        } else {
          setStatus(states.FAILED);
        }
      } else if (data) {
        console.log('data', data);
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
              <svg width="102" height="102" viewBox="0 0 102 102" fill="none">
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
                  <Button icon={Scan} onClick={() => switchConnectMethod(id)}>
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
                  <Button icon={Scan} onClick={() => switchConnectMethod(id)}>
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
              <Button
                onClick={() => alert('TODO: Disconnect')}
                icon={
                  <DisconnectIcon
                    style={{
                      transform: 'scale(0.75) ',
                      left: 3,
                      top: 0.5,
                    }}
                  />
                }
              >
                Disconnect
              </Button>
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
                    icon={Scan}
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
                    <Button icon={Scan} onClick={switchConnectMethod}>
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
