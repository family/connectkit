import React from 'react';
import { useContext, routes } from './../FamilyKit';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import { useConnect } from 'wagmi';
import Logos from '../../assets/logos';
import { ModalHeading } from '../Modal/styles';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 350px;
`;

const LearnMoreContainer = styled(motion.div)`
  padding: 0 0 2px;
  text-align: center;
`;
const LearnMoreButton = styled(motion.button)`
  appearance: none;
  cursor: pointer;
  display: inline-flex;
  background: none;
  color: var(--body-color-muted);
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  will-change: color, transform;
  transition: color 200ms ease, transform 100ms ease;

  &:hover {
    color: var(--body-color-muted-hover);
  }
  &:active {
    transform: scale(0.99);
  }
`;

const ConnectorsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 8px;
`;

const ConnectorButton = styled(motion.button)`
  --background: var(--body-background-secondary);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 16px;
  width: 100%;
  height: 64px;
  font-size: 17px;
  font-weight: 600;
  line-height: 20px;
  border-radius: 18px;
  color: var(--body-color);
  text-align: center;
  will-change: background-color, box-shadow, transform;
  transition: background-color 200ms ease, box-shadow 280ms ease,
    transform 100ms ease;

  background: var(--background);
  box-shadow: inset 0 0 0 0px var(--background),
    inset 0 0 0 0px var(--background);

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &:not(:disabled) {
    &:hover {
      box-shadow: inset 0 0 0 3px var(--family-brand),
        inset 0 0 0 6px var(--body-background);
      --background: var(--body-background-secondary-hover);
    }
    &:active {
      transform: scale(0.99);
    }
  }
`;

const ConnectorLabel = styled(motion.span)`
  width: 100%;
  padding: 0 64px;
`;

const ConnectorIcon = styled(motion.div)`
  position: absolute;
  left: 16px;
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: 8px;
`;

function getConnectorInfo(id: string) {
  switch (id) {
    case 'injected':
      return {
        name: 'MetaMask',
        logo: Logos.MetaMask,
      };
    case 'walletConnect':
      return {
        name: 'WalletConnect',
        logo: Logos.WalletConnect,
      };
    default:
      return {
        name: 'Default',
        logo: <></>,
      };
  }
}
const Wallets: React.FC = () => {
  const context = useContext();

  const { connect, connectors } = useConnect();

  return (
    <Container>
      <ModalHeading>Connect Wallet</ModalHeading>
      <ConnectorsContainer>
        {connectors.map((connector) => {
          const info = getConnectorInfo(connector.id);
          return (
            <ConnectorButton
              key={connector.id}
              //disabled={!connector.ready}
              onClick={() => {
                if (connector.id === 'walletConnect') {
                  context.setState({ open: true, route: routes.WALLETCONNECT });
                } else if (connector.id === 'injected') {
                  context.setState({ open: true, route: routes.METAMASK });
                } else {
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
        <LearnMoreButton
          onClick={() =>
            context.setState({ open: true, route: routes.KNOWLEDGEBASE })
          }
        >
          I don't have a wallet
        </LearnMoreButton>
      </LearnMoreContainer>
    </Container>
  );
};

export default Wallets;
