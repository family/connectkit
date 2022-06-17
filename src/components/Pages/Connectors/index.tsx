import React, { useEffect } from 'react';
import { useContext, routes } from '../../ConnectKit';
import supportedConnectors from '../../../constants/supportedConnectors';
import localizations from '../../../constants/localizations';

import { useConnect } from 'wagmi';

import {
  PageContent,
  ModalHeading,
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

  const { connectAsync, connectors } = useConnect({
    onError(e) {
      console.log(e);
    },
  });

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
      console.log(err);
    }
  };
  useEffect(() => {}, [mobile]);

  return (
    <PageContent style={{ width: 312 }}>
      {/* <ModalHeading>{copy.heading}</ModalHeading> */}
      <ModalHeadingBlock />
      {mobile ? (
        <>
          <MobileConnectorsContainer>
            {connectors.map((connector) => {
              const info = supportedConnectors.filter(
                (c) => c.id === connector.id
              )[0];
              if (!info) return null;
              return (
                <MobileConnectorButton
                  key={`m-${connector.id}`}
                  //disabled={!connector.ready}
                  onClick={() => openDefaultConnect(connector.id)}
                >
                  <MobileConnectorIcon>
                    {info.logos.mobile ??
                      info.logos.appIcon ??
                      info.logos.connectorButton}
                  </MobileConnectorIcon>
                  <MobileConnectorLabel>
                    {info.shortName ?? info.name ?? connector.name}
                  </MobileConnectorLabel>
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

          <LearnMoreContainer>
            <LearnMoreButton
              onClick={() => context.setRoute(routes.ONBOARDING)}
            >
              <WalletIcon /> {copy.newcomer}
            </LearnMoreButton>
          </LearnMoreContainer>
        </>
      )}
    </PageContent>
  );
};

export default Wallets;
