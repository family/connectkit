import React, { useState, useEffect } from 'react';
import { useContext, routes } from '../FamilyKit';
import { QRCode } from 'react-qrcode-logo';

import styled, { keyframes } from 'styled-components';
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

const PlaceholderKeyframes = keyframes`
  0%{ background-position: 100% 0; }
  100%{ background-position: -100% 0; }
`;
const QRPlaceholder = styled(motion.div)`
  height: 0;
  padding-bottom: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &:before {
    z-index: 4;
    content: '';
    position: absolute;
    inset: 0;
    transform: scale(1.5) rotate(45deg);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 50%,
      #f5f5f5,
      #f5f5f5,
      rgba(255, 255, 255, 0)
    );
    opacity: 0.75;
    background-size: 200% 100%;
    animation: ${PlaceholderKeyframes} 1800ms linear infinite both;
  }
`;

const QRPlaceholderContent = styled(motion.div)`
  position: absolute;
  inset: 12px;
  background: repeat;
  background-size: 2.4% 2.4%;
  background-image: url("data:image/svg+xml,%3Csvg width='7' height='7' viewBox='0 0 7 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23F5F5F5'/%3E%3C/svg%3E%0A");

  &:before,
  &:after {
    z-index: 1;
    content: '';
    position: absolute;
    inset: 30.5%;
    background: #fff;
  }
  &:after {
    z-index: 3;
    opacity: 0.8;
  }
`;
const QRCodeSkeleton = styled(motion.div)`
  position: absolute;
  background: #f5f5f5;
  border-radius: 9px;
  width: 13.5%;
  height: 13.5%;
  box-shadow: 0 0 0 3px white;
  &:before {
    content: '';
    position: absolute;
    inset: 8px;
    border-radius: 3px;
    background: inherit;
    box-shadow: 0 0 0 3px #fff;
  }
`;

const LogoIcon = styled(motion.div)`
  z-index: 2;
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
