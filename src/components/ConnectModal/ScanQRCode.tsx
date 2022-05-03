import React, { useState, useEffect } from 'react';
import { useContext, routes } from '../FamilyKit';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import CustomQRCode from '../CustomQRCode';
import Button from '../Button';
import { useConnect } from 'wagmi';
import { Listener } from '@ethersproject/abstract-provider';
import { OrDivider } from '../Modal';
import { ModalContent, ModalHeading } from '../Modal/styles';
import logos from '../../assets/logos';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;

const ScanQRCode: React.FC = () => {
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
    p.connect();
    p.connector.on('display_uri', handleQRCode);
  };

  useEffect(() => {
    if (!walletConnectURI) startWalletConnect();
  }, []);

  return (
    <Container>
      <ModalHeading>Scan QR Code</ModalHeading>
      <ModalContent style={{ paddingBottom: 4, gap: 14 }}>
        <CustomQRCode value={walletConnectURI} image={logos.WalletConnect} />
        <OrDivider />
      </ModalContent>
      <Button
        onClick={() => context.setRoute(routes.WALLETCONNECT_CONNECTING)}
        icon={logos.WalletConnect}
      >
        Open WalletConnect
      </Button>
    </Container>
  );
};

export default ScanQRCode;
