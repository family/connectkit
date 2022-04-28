import React, { useState, useEffect } from 'react';
import { useContext, routes } from './../FamilyKit';
import QRCode from 'react-qr-code';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import Button from '../Button';
import { useConnect } from 'wagmi';
import { Listener } from '@ethersproject/abstract-provider';
import { ModalHeading } from '../Modal/styles';

const Container = styled(motion.div)`
  min-width: 100%;
  width: 310px;
`;
const QRCodeContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px auto;
  width: 270px;
  height: 270px;
`;
const TextWithHr = styled(motion.div)`
  position: relative;
  display: block;
  text-align: center;
  color: var(--body-text-muted);
  font-size: 16px;
  line-height: 20px;
  span {
    z-index: 2;
    position: relative;
    display: inline-block;
    padding: 0 16px;
    background: var(--body-background);
  }
  &:before {
    z-index: 1;
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--body-divider);
  }
`;

const Spinner = styled(motion.div)`
  border-radius: 50%;
  width: 18em;
  height: 18em;
  margin: 60px auto;
  font-size: 2px;
  position: relative;
  text-indent: -9999em;
  border-top: 1em solid var(--body-background-secondary);
  border-right: 1em solid var(--body-background-secondary);
  border-bottom: 1em solid var(--body-background-secondary);
  border-left: 1em solid var(--body-color-muted);
  transform: translateZ(0);
  animation: spinner 1.1s infinite linear;
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const WalletConnect: React.FC = () => {
  const context = useContext();

  const { connectors } = useConnect();
  const [walletConnectURI, setWalletConnectURI] = useState<string | null>(null);

  const handleQRCode: Listener = (err, payload) => {
    if (err) console.log(err);
    const uri = payload.params[0];
    setWalletConnectURI(uri);
  };

  const startWalletConnect = async () => {
    const p = await connectors[0].getProvider();
    console.log(p);
    p.connect();
    p.connector.on('display_uri', handleQRCode);
  };

  useEffect(() => {
    if (!walletConnectURI) startWalletConnect();
  }, []);

  return (
    <Container>
      <ModalHeading>Scan QR Code</ModalHeading>
      <QRCodeContainer>
        {walletConnectURI && <QRCode value={walletConnectURI} size={270} />}
        {!walletConnectURI && <Spinner />}
      </QRCodeContainer>
      <TextWithHr>
        <span>or</span>
      </TextWithHr>
      <Button
        onClick={() => context.setState({ open: true, route: routes.METAMASK })}
      >
        Open WalletConnect
      </Button>
    </Container>
  );
};

export default WalletConnect;
