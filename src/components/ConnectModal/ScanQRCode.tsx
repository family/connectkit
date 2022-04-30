import React, { useState, useEffect } from 'react';
import { useContext, routes } from '../FamilyKit';
// import QRCode from 'react-qr-code';
import { QRCode } from 'react-qrcode-logo';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import Button from '../Button';
import { useConnect } from 'wagmi';
import { Listener } from '@ethersproject/abstract-provider';
import { OrDivider } from '../Modal';
import { ModalContent, ModalHeading } from '../Modal/styles';
import Logos from '../../assets/logos';
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
  margin: 2px auto 22px;
  padding: 12px;
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 24px;
  background: #fff;
`;

const QRPlaceholder = styled(motion.div)`
  position: absolute;
  inset: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const QRCodeSkeleton = styled(motion.div)`
  position: absolute;
  background: #e5e5e5;
  border-radius: 13px;
  width: 14%;
  height: 14%;
  box-shadow: inset 0 0 0 8px #e5e5e5, inset 0 0 0 14px white;
`;

const Spinner = styled(motion.div)`
  z-index: 2;
  border-radius: 50%;
  width: 18em;
  height: 18em;
  font-size: 2px;
  position: relative;
  text-indent: -9999em;
  border-top: 1em solid var(--family-brand);
  border-right: 1em solid var(--family-brand);
  border-bottom: 1em solid var(--family-brand);
  border-left: 1em solid #e5e5e5;
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
    border-radius: 19px;
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
      <ModalContent>
        <QRCodeContainer>
          <LogoIcon>{logos.WalletConnect}</LogoIcon>
          {walletConnectURI && (
            <QRCode
              logoImage={Logos.PlaceholderB64}
              removeQrCodeBehindLogo={true}
              value={walletConnectURI}
              size={270}
              qrStyle="dots"
              eyeRadius={12}
              ecLevel="M"
              logoWidth={76}
              logoHeight={76}
            />
          )}
          {!walletConnectURI && (
            <QRPlaceholder>
              <Spinner />
              <QRCodeSkeleton style={{ top: 0, right: 0 }} />
              <QRCodeSkeleton style={{ top: 0, left: 0 }} />
              <QRCodeSkeleton style={{ bottom: 0, left: 0 }} />
            </QRPlaceholder>
          )}
        </QRCodeContainer>
        <OrDivider />
      </ModalContent>
      <Button
        onClick={() =>
          context.setState({
            open: true,
            route: routes.WALLETCONNECT_CONNECTING,
          })
        }
      >
        Open WalletConnect
      </Button>
    </Container>
  );
};

export default ScanQRCode;
