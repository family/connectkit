import React from 'react';
import { useContext, routes } from '../../FamilyKit';
import supportedConnectors from '../../../constants/supportedConnectors';
import localizations from '../../../constants/localizations';

import { useConnect } from 'wagmi';

import { ModalHeading } from '../../Common/Modal/styles';
import WalletIcon from '../../../assets/wallet';

import {
  Container,
  LearnMoreContainer,
  LearnMoreButton,
  ConnectorsContainer,
  ConnectorButton,
  ConnectorLabel,
  ConnectorIcon,
} from './styles';

const Wallets: React.FC = () => {
  const context = useContext();
  const copy = localizations[context.lang].connectorsScreen;

  const { connect, connectors } = useConnect();

  return (
    <Container>
      <ModalHeading>{copy.heading}</ModalHeading>
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
              <ConnectorIcon
              //layoutId={info.name}
              >
                {info.logo}
              </ConnectorIcon>
              <ConnectorLabel>{info.name}</ConnectorLabel>
            </ConnectorButton>
          );
        })}
      </ConnectorsContainer>
      {/* <ConnectorContent>
        {tab === 'injected' && isConnecting ? (
          <motion.div style={{ opacity: 0.3 }}>Connecting...</motion.div>
        ) : null}
        {walletConnectURI && tab === 'walletConnect' ? (
          <QRCode value={walletConnectURI} />
        ) : null}
      </ConnectorContent> */}
      {/* {connectors.map((connector) => (
          <button key={connector.id} disabled={!connector.ready} onClick={() => connect(connector)}>
            {connector.name}
            {isConnecting && pendingConnector?.id === connector.id && ' (connecting)'}
          </button>
        ))} */}
      {/* <span></span>{error ? error.message : ''} */}

      <LearnMoreContainer>
        <LearnMoreButton onClick={() => context.setRoute(routes.ONBOARDING)}>
          <WalletIcon /> {copy.newcomer}
        </LearnMoreButton>
      </LearnMoreContainer>
    </Container>
  );
};

export default Wallets;
