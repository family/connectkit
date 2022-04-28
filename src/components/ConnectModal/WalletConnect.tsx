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
  width: 100%;
`;
const QRCodeContainer = styled(motion.div)`
  width: 256px;
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
    const p = await connectors[1].getProvider();
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
        {walletConnectURI && <QRCode value={walletConnectURI} size={256} />}
      </QRCodeContainer>
      <Button
        onClick={() => context.setState({ open: true, route: routes.CONNECT })}
      >
        Back
      </Button>
    </Container>
  );
};

export default WalletConnect;
