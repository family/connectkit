import { OpenfortErrorType } from '@openfort/openfort-js'
import { AnimatePresence, type Variants } from 'framer-motion'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { AlertIcon, RetryIconCircle, TickIcon } from '../../../assets/icons'
import { useConnectWithSiwe } from '../../../hooks/openfort/useConnectWithSiwe'
import { useUser } from '../../../hooks/openfort/useUser'
import { useConnect } from '../../../hooks/useConnect'
import useLocales from '../../../hooks/useLocales'
import { useRouteProps } from '../../../hooks/useRouteProps'
import { detectBrowser, isWalletConnectConnector } from '../../../utils'
import { logger } from '../../../utils/logger'
import { useWallet } from '../../../wallets/useWallets'
import Alert from '../../Common/Alert'
import BrowserIcon from '../../Common/BrowserIcon'
import Button from '../../Common/Button'
import { ModalBody, ModalContent, ModalContentContainer, ModalH1, ModalHeading } from '../../Common/Modal/styles'
import SquircleSpinner from '../../Common/SquircleSpinner'
import Tooltip from '../../Common/Tooltip'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import CircleSpinner from './CircleSpinner'
import { ConnectingAnimation, ConnectingContainer, Container, Content, RetryButton, RetryIconContainer } from './styles'

const states = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  EXPIRING: 'expiring',
  FAILED: 'failed',
  REJECTED: 'rejected',
  NOTCONNECTED: 'notconnected',
  UNAVAILABLE: 'unavailable',
  DUPLICATED: 'duplicated',
  SIWE: 'siwe',
  RECOVER_ADDRESS_MISMATCH: 'recoverAddressMismatch',
}

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
}

const ConnectWithInjector: React.FC<{
  switchConnectMethod: (id?: string) => void
  forceState?: typeof states
}> = ({ forceState }) => {
  const { setOpen } = useOpenfort()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const connectWithSiwe = useConnectWithSiwe()
  const props = useRouteProps(routes.CONNECT)
  const { user } = useUser()

  const onConnect = useCallback(() => {
    setStatus(states.CONNECTED)
    setTimeout(() => {
      triggerResize()
    }, 250)
    setTimeout(() => {
      setOpen(false)
    }, 1250)
  }, [])

  const { connect } = useConnect({
    mutation: {
      onMutate: (connector?: any) => {
        if (connector.connector) {
          setStatus(states.CONNECTING)
        } else {
          setStatus(states.UNAVAILABLE)
        }
      },
      onError(err?: any) {
        logger.error(err)
      },
      onSettled(data?: any, error?: any) {
        logger.log(`onSettled - data: ${data}, error: ${error}`, data)
        if (error) {
          setShowTryAgainTooltip(true)
          setTimeout(() => setShowTryAgainTooltip(false), 3500)
          if (error.code) {
            // https://github.com/MetaMask/eth-rpc-errors/blob/main/src/error-constants.ts
            switch (error.code) {
              case -32002:
                setStatus(states.NOTCONNECTED)
                break
              case 4001:
                setStatus(states.REJECTED)
                break
              default:
                setStatus(states.FAILED)
                break
            }
          } else {
            // Sometimes the error doesn't respond with a code
            if (error.message) {
              switch (error.message) {
                case 'User rejected request':
                  setStatus(states.REJECTED)
                  break
                default:
                  setStatus(states.FAILED)
                  break
              }
            }
          }
        } else if (data) {
          if (!wallet) {
            setStatus(states.FAILED)
            logger.error('No wallet found')
            throw new Error('No wallet found')
          }

          if (props.connectType === 'recover') {
            wallet.connector.getAccounts().then((acc) => {
              if (acc.some((v) => v === props.wallet.address)) {
                onConnect()
              } else {
                setStatus(states.RECOVER_ADDRESS_MISMATCH)
                disconnect()
              }
            })
            return
          }

          const userWallets = user?.linkedAccounts.filter(
            (acc) =>
              acc.walletClientType === wallet.connector?.name.toLowerCase() ||
              acc.walletClientType === wallet.connector?.id
          )
          // // If already has linked account, don't link again
          if (userWallets && userWallets.length > 0) {
            wallet.connector.getAccounts().then((acc) => {
              if (acc.some((v) => userWallets.some((w) => w.address === v))) {
                onConnect()
              } else {
                setStatus(states.RECOVER_ADDRESS_MISMATCH)
                disconnect()
              }
            })
            return
          }

          setStatus(states.SIWE)

          connectWithSiwe({
            // connectorType: wallet.connector.id,
            // walletClientType: wallet.connector.name.toLowerCase(),
            onError: (error, errorType) => {
              logger.error(error)
              disconnect()
              if (errorType === OpenfortErrorType.AUTHENTICATION_ERROR) {
                setStatus(states.DUPLICATED)
              } else {
                setStatus(states.FAILED)
              }
            },
            onConnect: () => {
              onConnect()
            },
          })
        }
        setTimeout(triggerResize, 100)
      },
    },
  })

  const { triggerResize, connector: c } = useOpenfort()
  const id = c.id
  const wallet = useWallet(id)

  const walletInfo = {
    name: wallet?.name,
    shortName: wallet?.shortName ?? wallet?.name,
    icon: wallet?.iconConnector ?? wallet?.icon,
    iconShape: wallet?.iconShape ?? 'circle',
    iconShouldShrink: wallet?.iconShouldShrink,
  }

  const [showTryAgainTooltip, setShowTryAgainTooltip] = useState(false)

  const expiryDefault = 9 // Starting at 10 causes layout shifting, better to start at 9
  const [_expiryTimer, _setExpiryTimer] = useState<number>(expiryDefault)

  const browser = detectBrowser()

  const extensionUrl = wallet?.downloadUrls?.[browser]

  const suggestedExtension = wallet?.downloadUrls
    ? {
        name: Object.keys(wallet?.downloadUrls)[0],
        label:
          Object.keys(wallet?.downloadUrls)[0]?.charAt(0).toUpperCase() +
          Object.keys(wallet?.downloadUrls)[0]?.slice(1), // Capitalise first letter, but this might be better suited as a lookup table
        url: wallet?.downloadUrls[Object.keys(wallet?.downloadUrls)[0]],
      }
    : undefined

  const [status, setStatus] = useState(
    forceState ? forceState : !wallet?.isInstalled ? states.UNAVAILABLE : states.CONNECTING
  )

  const locales = useLocales({
    CONNECTORNAME: walletInfo.name,
    CONNECTORSHORTNAME: walletInfo.shortName ?? walletInfo.name,
    SUGGESTEDEXTENSIONBROWSER: suggestedExtension?.label ?? 'your browser',
  })

  const runConnect = async () => {
    if (wallet?.isInstalled && wallet?.connector) {
      // Disconnect if already connected
      if (isConnected) disconnect()

      connect({ connector: wallet?.connector })
    } else {
      setStatus(states.UNAVAILABLE)
    }
  }

  let connectTimeout: any
  useEffect(() => {
    if (status === states.UNAVAILABLE) return

    // UX: Give user time to see the UI before opening the extension
    connectTimeout = setTimeout(runConnect, 600)
    return () => {
      clearTimeout(connectTimeout)
    }
  }, [])

  /* Timeout functionality if necessary
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

  if (!wallet) {
    return (
      <PageContent>
        <Container>
          <ModalHeading>Invalid State</ModalHeading>
          <ModalContent>
            <Alert>No connectors match the id given. This state should never happen.</Alert>
          </ModalContent>
        </Container>
      </PageContent>
    )
  }

  // OLD_TODO: Make this more generic
  if (isWalletConnectConnector(wallet?.connector.id)) {
    return (
      <PageContent>
        <Container>
          <ModalHeading>Invalid State</ModalHeading>
          <ModalContent>
            <Alert>WalletConnect does not have an injection flow. This state should never happen.</Alert>
          </ModalContent>
        </Container>
      </PageContent>
    )
  }

  const hasError =
    status === states.FAILED ||
    status === states.REJECTED ||
    status === states.DUPLICATED ||
    status === states.RECOVER_ADDRESS_MISMATCH

  return (
    <PageContent>
      <Container>
        <ConnectingContainer>
          <ConnectingAnimation $shake={hasError} $circle={walletInfo.iconShape === 'circle'}>
            <AnimatePresence>
              {hasError && (
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
                    <Tooltip open={showTryAgainTooltip && hasError} message={locales.tryAgainQuestion} xOffset={-6}>
                      <RetryIconCircle />
                    </Tooltip>
                  </RetryIconContainer>
                </RetryButton>
              )}
            </AnimatePresence>
            {walletInfo.iconShape === 'circle' ? (
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
                      {walletInfo.icon}
                    </div>
                  ) : (
                    walletInfo.icon
                  )
                }
                smallLogo={walletInfo.iconShouldShrink}
                connecting={status === states.CONNECTING || status === states.SIWE}
                unavailable={status === states.UNAVAILABLE}
              />
            ) : (
              <SquircleSpinner
                logo={
                  status === states.UNAVAILABLE ? (
                    <div
                      style={{
                        transform: 'scale(1.14)',
                        position: 'relative',
                        width: '100%',
                      }}
                    >
                      {walletInfo.icon}
                    </div>
                  ) : (
                    walletInfo.icon
                  )
                }
                connecting={status === states.CONNECTING || status === states.SIWE}
                //unavailable={status === states.UNAVAILABLE}
              />
            )}
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
                {/* 
                {wallet?.getWalletConnectDeeplink &&
                  wallet.id !== 'coinbaseWalletSDK' && (
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
                   */}
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
                  style={{
                    paddingBottom: 28,
                  }}
                >
                  <ModalH1>{locales.injectionScreen_rejected_h1}</ModalH1>
                  <ModalBody>{locales.injectionScreen_rejected_p}</ModalBody>
                </ModalContent>

                {/* Reason: Coinbase Wallet does not expose a QRURI when extension is installed */}
                {/* 
                {wallet?.getWalletConnectDeeplink &&
                  wallet.id !== 'coinbaseWalletSDK' && (
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
                   */}
              </Content>
            )}

            {status === states.RECOVER_ADDRESS_MISMATCH && (
              <Content
                key={states.RECOVER_ADDRESS_MISMATCH}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                <ModalContent
                  style={{
                    paddingBottom: 28,
                  }}
                >
                  <ModalH1>Wallet mismatch</ModalH1>
                  <ModalBody>The wallet address you are trying to recover does not belong to this user.</ModalBody>
                </ModalContent>
              </Content>
            )}
            {status === states.DUPLICATED && (
              <Content
                key={states.DUPLICATED}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                <ModalContent style={{ paddingBottom: 28 }}>
                  <ModalH1 $error>
                    <AlertIcon />
                    {locales.injectionScreen_failed_h1}
                  </ModalH1>
                  <ModalBody>This wallet is already linked to another player. Please try another wallet.</ModalBody>
                  {/* TODO: Localize */}
                </ModalContent>
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
                <ModalContent
                  style={{
                    paddingBottom: 28,
                  }}
                >
                  <ModalH1>
                    {wallet.connector.id === 'injected'
                      ? locales.injectionScreen_connecting_injected_h1
                      : locales.injectionScreen_connecting_h1}
                  </ModalH1>
                  <ModalBody>
                    {wallet.connector.id === 'injected'
                      ? locales.injectionScreen_connecting_injected_p
                      : locales.injectionScreen_connecting_p}
                  </ModalBody>
                </ModalContent>
              </Content>
            )}

            {status === states.SIWE && (
              <Content
                key={states.SIWE}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                <ModalContent
                  style={{
                    paddingBottom: 28,
                  }}
                >
                  <ModalH1>Confirm in your wallet</ModalH1>
                  <ModalBody>
                    Sign the message in your wallet to confirm that you own this wallet and complete the connection.
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
                    <TickIcon /> Connected
                  </ModalH1>
                  <ModalBody>Successfully connected with {walletInfo.name}.</ModalBody>
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
                  <ModalBody>{locales.injectionScreen_notconnected_p}</ModalBody>
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
                      <ModalH1>{locales.injectionScreen_unavailable_h1}</ModalH1>
                      <ModalBody>{locales.injectionScreen_unavailable_p}</ModalBody>
                    </ModalContent>

                    {!wallet.isInstalled && suggestedExtension && (
                      <Button href={suggestedExtension?.url} icon={<BrowserIcon browser={suggestedExtension?.name} />}>
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
                    {/*
                    {(wallet.getWalletConnectDeeplink &&
                    (!wallet.isInstalled && extensionUrl)) && <OrDivider />}

                    {wallet.getWalletConnectDeeplink && (
                      <Button icon={<Scan />} onClick={switchConnectMethod}>
                        {locales.scanTheQRCode}
                      </Button>
                    )}
                    */}
                    {!wallet.isInstalled && extensionUrl && (
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
  )
}

export default ConnectWithInjector
