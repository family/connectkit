import React, { useEffect } from 'react';
import { useContext, routes } from '../../ConnectKit';
import supportedConnectors from '../../../constants/supportedConnectors';
import localizations from '../../../constants/localizations';

import { useConnect } from 'wagmi';

import { PageContent, ModalHeading } from '../../Common/Modal/styles';
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
} from './styles';
import { isMobile } from '../../../utils';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import Button from '../../Common/Button';

const Wallets: React.FC = () => {
  const context = useContext();
  const copy = localizations[context.lang].connectorsScreen;

  const mobile = isMobile();

  const { connect, connectAsync, connectors } = useConnect({
    onError(e) {
      alert(e);
    },
  });

  const openDefaultConnect = async (id: string) => {
    const c = connectors.filter((c) => c.id === id)[0];
    let connector;
    switch (c.id) {
      case 'walletConnect':
        connector = new WalletConnectConnector({
          chains: c.chains,
          options: { ...c.options, qrcode: true },
        });
        break;
      case 'metaMask':
        //TODO: Fix broken connector
        connector = new MetaMaskConnector({
          chains: c.chains,
          options: c.options,
        });
        break;
      case 'coinbaseWallet':
        connector = new CoinbaseWalletConnector({
          chains: c.chains,
          options: c.options,
        });
        break;
    }
    if (connector) await connectAsync(connector);
  };
  useEffect(() => {}, [mobile]);

  return (
    <PageContent style={{ width: 334 }}>
      <ModalHeading>{copy.heading}</ModalHeading>
      {mobile ? (
        <MobileConnectorsContainer>
          {connectors
            .slice(0)
            .reverse()
            .map((connector) => {
              const info = supportedConnectors.filter(
                (c) => c.id === connector.id
              )[0];
              return (
                <MobileConnectorButton
                  key={`m-${connector.id}`}
                  //disabled={!connector.ready}
                  onClick={() => openDefaultConnect(connector.id)}
                >
                  <MobileConnectorIcon>{info.logo}</MobileConnectorIcon>
                  <MobileConnectorLabel>{info.name}</MobileConnectorLabel>
                </MobileConnectorButton>
              );
            })}
        </MobileConnectorsContainer>
      ) : (
        <ConnectorsContainer>
          {connectors.map((connector) => {
            const info = supportedConnectors.filter(
              (c) => c.id === connector.id
            )[0];
            return (
              <ConnectorButton
                key={connector.id}
                //disabled={!connector.ready}
                onClick={() => {
                  if (
                    connector.id === 'metaMask' ||
                    connector.id === 'walletConnect' ||
                    connector.id === 'coinbaseWallet'
                  ) {
                    context.setRoute(routes.CONNECT);
                    context.setConnector(connector.id);
                  } else {
                    console.error('Not a valid route?');
                    connect(connector);
                  }
                }}
              >
                <ConnectorIcon>{info.logo}</ConnectorIcon>
                <ConnectorLabel>{info.name}</ConnectorLabel>
              </ConnectorButton>
            );
          })}
        </ConnectorsContainer>
      )}

      <LearnMoreContainer>
        {mobile ? (
          <Button
            icon={<WalletIcon />}
            onClick={() => context.setRoute(routes.ONBOARDING)}
          >
            {copy.newcomer}
          </Button>
        ) : (
          <LearnMoreButton onClick={() => context.setRoute(routes.ONBOARDING)}>
            <WalletIcon /> {copy.newcomer}
          </LearnMoreButton>
        )}
      </LearnMoreContainer>
    </PageContent>
  );
};

export default Wallets;
