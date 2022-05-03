import React, { useState, useEffect } from 'react';
import { useContext, routes } from '../FamilyKit';
import { QRCode } from 'react-qrcode-logo';

import styled from 'styled-components';
import { motion } from 'framer-motion';

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
const QRCodeContainer = styled(motion.div)`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px auto 6px;
  padding: 4px;
  width: 100%;
  border-radius: 24px;
  background: #fff;
  canvas {
    display: block;
    max-width: 100%;
    width: 100% !important;
    height: auto !important;
  }
`;

const QRPlaceholder = styled(motion.div)`
  height: 0;
  padding-bottom: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const QRPlaceholderContent = styled(motion.div)`
  position: absolute;
  inset: 12px;
`;
const QRCodeSkeleton = styled(motion.div)`
  position: absolute;
  background: #e5e5e5;
  border-radius: 13px;
  width: 14%;
  height: 14%;
  box-shadow: inset 0 0 0 8px #e5e5e5, inset 0 0 0 14px white;
`;

const LogoIcon = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 25.7%;
  height: 25.7%;
  transform: translate3d(-50%, -50%, 0);
  & svg {
    width: 100%;
    height: 100%;
    border-radius: 17px;
  }
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
        <QRCodeContainer>
          <LogoIcon>{logos.WalletConnect}</LogoIcon>
          {walletConnectURI && (
            <QRCode
              bgColor="transparent"
              logoImage={btoa(logos.WalletConnect.toString())}
              removeQrCodeBehindLogo={true}
              value={walletConnectURI}
              size={288}
              qrStyle="dots"
              eyeRadius={12}
              ecLevel="M"
              logoWidth={76}
              logoHeight={76}
            />
          )}
          {!walletConnectURI && (
            <QRPlaceholder>
              <QRPlaceholderContent>
                <QRCodeSkeleton style={{ top: 0, right: 0 }} />
                <QRCodeSkeleton style={{ top: 0, left: 0 }} />
                <QRCodeSkeleton style={{ bottom: 0, left: 0 }} />
              </QRPlaceholderContent>
            </QRPlaceholder>
          )}
        </QRCodeContainer>
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
