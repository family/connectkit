import React from 'react';
import { useContext, routes } from './../FamilyKit';
import supportedConnectors from '../../constants/supportedConnectors';
import localizations from '../../constants/localizations';

import { useConnect } from 'wagmi';

import { ModalHeading } from '../Modal/styles';
import WalletIcon from '../../assets/wallet';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 334px;
`;

const LearnMoreContainer = styled(motion.div)`
  margin: 0 0 -4px; // offset for button being tall
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
  height: 42px;
  padding: 0;
  background: none;
  color: var(--body-color-muted);
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  transition: color 200ms ease, transform 100ms ease;
  svg {
    display: block;
    position: relative;
    top: 2.5px;
    path,
    circle {
      transition: all 100ms ease-out;
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
  padding: 0 0 16px;
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
  font-weight: 500;
  line-height: 20px;
  border-radius: 18px;
  color: var(--body-color);
  text-align: center;
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
      box-shadow: inset 0 0 0 3px var(--body-background-secondary-hover-outline),
        inset 0 0 0 6px var(--body-background);
      //--background: var(--body-background-secondary-hover);
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
