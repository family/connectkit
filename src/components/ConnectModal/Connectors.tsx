import React from 'react';
import { useContext, routes } from './../FamilyKit';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import { useConnect } from 'wagmi';
import Logos from '../../assets/logos';
import { ModalHeading } from '../Modal/styles';
import logos from '../../assets/logos';
import WalletIcon from '../../assets/wallet';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 334px;
`;

const LearnMoreContainer = styled(motion.div)`
  padding: 0 0 2px;
  text-align: center;
`;
const LearnMoreButton = styled(motion.button)`
  appearance: none;
  user-select: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0;
  background: none;
  color: var(--body-color-muted);
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  will-change: color, transform;
  transition: color 200ms ease, transform 100ms ease;
  svg {
    display: block;
    position: relative;
    top: 2.5px;
    path,
    circle {
      transition: all 200ms ease-out;
    }
    path:last-of-type {
      transform-origin: 0 0;
      transform: scaleX(1.3) skewY(-12deg);
      opacity: 0;
    }
    circle {
      transform: translate(20%, -15%);
    }
  }
  &:hover {
    color: var(--body-color-muted-hover);
    svg {
      path,
      circle {
        opacity: 1;
        transform: none;
      }
    }
  }
  &:active {
    transform: scale(0.96);
  }
`;

const ConnectorsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 0 28px;
`;

const ConnectorButton = styled(motion.button)`
  --background: var(--body-background-secondary);
  cursor: pointer;
  user-select: none;
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
  //console.log(id);
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
    case 'coinbaseWallet':
      return {
        name: 'Coinbase Wallet',
        logo: Logos.Coinbase,
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
                  context.setRoute(routes.WALLETCONNECT);
                  context.setConnector(connector);
                } else if (connector.id === 'injected') {
                  context.setRoute(routes.METAMASK);
                  context.setConnector(connector);
                } else if (connector.id === 'coinbaseWallet') {
                  context.setRoute(routes.COINBASE);
                  context.setConnector(connector);
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
          <WalletIcon /> I don't have a wallet
        </LearnMoreButton>
      </LearnMoreContainer>
    </Container>
  );
};

export default Wallets;
