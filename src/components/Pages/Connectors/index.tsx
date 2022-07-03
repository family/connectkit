import React, { useEffect } from 'react';
import { useContext, routes } from '../../ConnectKit';
import supportedConnectors from '../../../constants/supportedConnectors';
import localizations from '../../../constants/localizations';
import { isMetaMask, isCoinbaseWallet } from './../../../utils';

import { useConnect } from '../../../hooks/useConnect';

import {
  PageContent,
  ModalH1,
  ModalBody,
  ModalContent,
  ModalHeadingBlock,
} from '../../Common/Modal/styles';
import WalletIcon from '../../../assets/wallet';

import {
  LearnMoreContainer,
  LearnMoreButton,
  ConnectorsContainer,
  ConnectorButton,
  ConnectorLabel,
  ConnectorIcon,
  MobileConnectorsContainer,
  MobileConnectorButton,
  MobileConnectorLabel,
  MobileConnectorIcon,
  InfoBox,
  InfoBoxButtons,
} from './styles';

import { isMobile, isAndroid } from '../../../utils';

import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';

import Button from '../../Common/Button';

const Wallets: React.FC = () => {
  const context = useContext();
  const copy = localizations[context.lang].connectorsScreen;
  const mobile = isMobile();

  const { connectAsync, connectors } = useConnect();

  const openDefaultConnect = async (id: string) => {
    const c = connectors.filter((c) => c.id === id)[0];
    let connector = null;
    switch (c.id) {
      case 'walletConnect':
        context.setRoute(routes.MOBILECONNECTORS);
        break;
      /*
        connector = new WalletConnectConnector({
          chains: c.chains,
          options: { ...c.options, qrcode: true },
        });
        break;
        */
      case 'metaMask':
        connector = new WalletConnectConnector({
          chains: c.chains,
          options: { ...c.options, qrcode: false },
        });
        break;
      case 'coinbaseWallet':
        connector = new CoinbaseWalletConnector({
          chains: c.chains,
          options: c.options,
        });
        break;
      case 'injected':
        connector = new InjectedConnector({
          chains: c.chains,
          options: c.options,
        });
        break;
    }

    if (!connector) return;

    // TODO: Make this neater
    if (c.id == 'metaMask' && isMobile) {
      let connnector = connector as WalletConnectConnector;
      connector.on('message', async ({ type }) => {
        if (type === 'connecting') {
          const { uri } = (await connnector.getProvider()).connector;
          const uriString = isAndroid()
            ? uri
            : `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`;
          window.location.href = uriString;
        }
      });
    }

    try {
      await connectAsync(connector);
    } catch (err) {
      context.debug('Async connect error', err);
    }
  };
  useEffect(() => {}, [mobile]);

  /**
   * Some injected connectors pretend to be metamask, this helps avoid that issue.
   */

  const shouldShowInjectedConnector = () => {
    // Only display if an injected connector is detected
    const { ethereum } = window;

    const needsInjectedWalletFallback =
      typeof window !== 'undefined' &&
      ethereum &&
      !isMetaMask() &&
      !isCoinbaseWallet();
    //!ethereum?.isBraveWallet; // TODO: Add this line when Brave is supported

    return needsInjectedWalletFallback;
  };

  return (
    <PageContent style={{ width: 312 }}>
      <ModalHeadingBlock />
      {mobile ? (
        <>
          <MobileConnectorsContainer>
            {connectors.map((connector) => {
              const info = supportedConnectors.filter(
                (c) => c.id === connector.id
              )[0];
              if (!info) return null;

              if (info.id === 'injected') {
                // TODO: Is this necessary? (Dennis)
                // if (!shouldShowInjectedConnector()) return null;
              }

              let name = info.shortName ?? info.name ?? connector.name;

              // Specific case for Wallet Connect naming
              if (
                info.id === 'walletConnect' &&
                !shouldShowInjectedConnector()
              ) {
                name = info.name ?? connector.name;
              }

              return (
                <MobileConnectorButton
                  key={`m-${connector.id}`}
                  //disabled={!connector.ready}
                  onClick={() => {
                    if (
                      info.id === 'injected' ||
                      (info.id === 'metaMask' && isMetaMask())
                    ) {
                      context.setRoute(routes.CONNECT);
                      context.setConnector(connector.id);
                    } else {
                      openDefaultConnect(connector.id);
                    }
                  }}
                >
                  <MobileConnectorIcon>
                    {info.logos.mobile ??
                      info.logos.appIcon ??
                      info.logos.connectorButton}
                  </MobileConnectorIcon>
                  <MobileConnectorLabel>{name}</MobileConnectorLabel>
                </MobileConnectorButton>
              );
            })}
          </MobileConnectorsContainer>
          <InfoBox>
            <ModalContent style={{ padding: 0, textAlign: 'left' }}>
              <ModalH1 $small>{copy.h1}</ModalH1>
              <ModalBody>{copy.p}</ModalBody>
            </ModalContent>
            <InfoBoxButtons>
              <Button onClick={() => context.setRoute(routes.ABOUT)}>
                Learn More
              </Button>
              <Button onClick={() => context.setRoute(routes.ONBOARDING)}>
                Get a Wallet
              </Button>
            </InfoBoxButtons>
          </InfoBox>
        </>
      ) : (
        <>
          <ConnectorsContainer>
            {connectors.map((connector) => {
              const info = supportedConnectors.filter(
                (c) => c.id === connector.id
              )[0];
              if (!info) return null;
              let logo = info.logos.connectorButton ?? info.logos.default;
              if (info.extensionIsInstalled && info.logos.appIcon) {
                if (info.extensionIsInstalled()) {
                  logo = info.logos.appIcon;
                }
              }

              if (info.id === 'injected') {
                // TODO: Is this necessary? (Dennis)
                // if (!shouldShowInjectedConnector()) return null;
              }
              return (
                <ConnectorButton
                  key={connector.id}
                  disabled={context.route !== routes.CONNECTORS}
                  onClick={() => {
                    context.setRoute(routes.CONNECT);
                    context.setConnector(connector.id);
                  }}
                >
                  <ConnectorIcon>{logo}</ConnectorIcon>
                  <ConnectorLabel>{info.name ?? connector.name}</ConnectorLabel>
                </ConnectorButton>
              );
            })}
          </ConnectorsContainer>

          {!context.options?.hideNoWalletCTA && (
            <LearnMoreContainer>
              <LearnMoreButton
                onClick={() => context.setRoute(routes.ONBOARDING)}
              >
                <WalletIcon /> {copy.newcomer}
              </LearnMoreButton>
            </LearnMoreContainer>
          )}
        </>
      )}
    </PageContent>
  );
};

export default Wallets;
