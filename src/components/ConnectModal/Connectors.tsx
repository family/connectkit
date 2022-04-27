import React, { useState } from 'react';
import { useContext, routes } from './../FamilyKit';

import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { Props } from 'framer-motion/types/types';

import { useConnect } from 'wagmi';
import { Listener } from '@ethersproject/abstract-provider';

import QRCode from 'react-qr-code';
import Button from '../Button';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 360px;
`;
const LearnMoreContainer = styled(motion.div)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 24px 0 0;
  color: #939393;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  transition: color 200ms ease;
  &:hover {
    color: #111;
  }
`;

const ConnectorsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ConnectorsHeading = styled(motion.div)`
  text-align: center;
  font-size: 16px;
  line-height: 19px;
  font-weight: 600;
  margin: 0;
  padding: 0 0 16px;
`;

const ConnectorButton = styled(motion.button)`
  cursor: pointer;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 17px;
  border-radius: 18px;
  background: #f6f7f9;
  transition: background 80ms ease;
  &:hover {
    background: #ebebeb;
  }
  &:focus {
    outline: 2px solid #ebebeb;
  }
`;

const ConnectorContent = styled(motion.div)`
  margin-left: 16px;
  width: 256px;
  height: 256px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
`;

const ConnectorIcon = styled(motion.img)`
  margin-right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
`;

const InfoIcon = (props: Props) => (
  <motion.svg
    width={14}
    height={14}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g opacity="0.4">
      <circle cx="7" cy="7" r="6.3" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M5.9498 7.35L5.9498 9.45C5.9498 10.0299 6.41991 10.5 6.9998 10.5C7.5797 10.5 8.0498 10.0299 8.0498 9.45L8.0498 7.35C8.04981 6.7701 7.5797 6.3 6.9998 6.3C6.41991 6.3 5.9498 6.7701 5.9498 7.35Z"
        fill="currentColor"
      />
      <ellipse
        cx="6.9998"
        cy="4.55156"
        rx="1.05"
        ry="1.05"
        transform="rotate(-180 6.9998 4.55156)"
        fill="currentColor"
      />
    </g>
  </motion.svg>
);

function getConnectorIcon(id: string) {
  const connectorAssets = {
    // TODO: Autopath
    injected: require('../../assets/metamask@3x.png'),
    walletConnect: require('../../assets/walletconnect@3x.png'),
    default: require('../../assets/blank@3x.png'),
  };

  switch (id) {
    case 'injected':
      return connectorAssets.injected;
    case 'walletConnect':
      return connectorAssets.walletConnect;
    default:
      return connectorAssets.default;
  }
}
const Wallets: React.FC = () => {
  const context = useContext();

  const {
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
    reset,
    isConnected,
  } = useConnect();

  const [tab, setTab] = useState<string>('metamask');
  const [walletConnectURI, setWalletConnectURI] = useState<string | null>(null);

  const handleQRCode: Listener = (err, payload) => {
    if (err) console.log(err);
    const uri = payload.params[0];
    setWalletConnectURI(uri);
  };

  const startWalletConnect = async () => {
    const p = await connectors[1].getProvider();
    p.connect();
    p.connector.on('display_uri', handleQRCode);
  };

  return (
    <Container>
      <ConnectorsHeading>Connect a Wallet</ConnectorsHeading>
      <ConnectorsContainer>
        {connectors.map((connector) => {
          return (
            <ConnectorButton
              key={connector.id}
              // disabled={!x.ready}
              onClick={() => {
                if (connector.id === 'walletConnect') {
                  startWalletConnect();
                } else {
                  connect(connector);
                }
                setTab(connector.id);
              }}
            >
              <ConnectorIcon
                width={32}
                height={32}
                src={getConnectorIcon(connector.id)}
              />
              {connector.name}
              {/* {isConnecting &&
                  pendingConnector?.id === connector.id &&
                  ' (connecting)'} */}
            </ConnectorButton>
          );
        })}
      </ConnectorsContainer>
      <Button
        onClick={() => context.setState({ open: true, route: routes.TESTPAGE })}
      >
        Open QR Code
      </Button>
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
      <LearnMoreContainer
        onClick={() =>
          context.setState({ open: true, route: routes.KNOWLEDGEBASE })
        }
      >
        <InfoIcon />
        Learn more about Wallets
      </LearnMoreContainer>
    </Container>
  );
};

export default Wallets;
