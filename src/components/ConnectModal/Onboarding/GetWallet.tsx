import React from 'react';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import {
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeading,
} from '../../Modal/styles';
import logos from '../../../assets/logos';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;

const WalletList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 0 0;
`;
const WalletItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 14px;
`;
const WalletButton = styled(motion.button)`
  appearance: none;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 9px;
  height: 24px;
  border-radius: 12px;
  color: var(--body-color);
  background: var(--body-background-secondary);
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  text-transform: uppercase;
  will-change: color, transform;
  transition: background 200ms ease, transform 100ms ease;

  &:hover {
    background: var(--body-background-secondary-hover);
  }
  &:active {
    transform: scale(0.96);
  }
`;
const WalletInfo = styled(motion.div)`
  width: 100%;
`;
const WalletName = styled(motion.div)`
  color: var(--body-color);
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
`;
const WalletPlatform = styled(motion.div)`
  color: var(--body-color-muted);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;
const WalletLogo = styled(motion.div)`
  position: relative;
  overflow: hidden;
  display: block;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 9.5px;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  }
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;
let wallets: any = [
  {
    name: 'MetaMask',
    platform: 'Mobile & Desktop',
    logo: logos.MetaMask,
  },
  {
    name: 'Coinbase Wallet',
    platform: 'Mobile & Desktop',
    logo: logos.Coinbase,
  },
  {
    name: 'Trust',
    platform: 'Mobile',
    logo: logos.Trust,
  },
];

const GetWallet: React.FC = () => {
  return (
    <Container>
      <ModalHeading>Get a Wallet</ModalHeading>
      <ModalContent style={{ textAlign: 'left' }}>
        <ModalH1>Some copy (maybe)</ModalH1>
        <ModalBody>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus
          vulputate donec risus etiam consectetur posuere volutpat.
        </ModalBody>
      </ModalContent>
      <WalletList>
        {wallets.map((wallet: any, i: number) => {
          return (
            <WalletItem
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
            >
              <WalletLogo>{wallet.logo}</WalletLogo>
              <WalletInfo>
                <WalletName>{wallet.name}</WalletName>
                <WalletPlatform>{wallet.platform}</WalletPlatform>
              </WalletInfo>
              <WalletButton>Get</WalletButton>
            </WalletItem>
          );
        })}
      </WalletList>
    </Container>
  );
};

export default GetWallet;
