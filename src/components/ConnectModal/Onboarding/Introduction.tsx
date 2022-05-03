import React from 'react';

import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

import {
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeading,
} from '../../Modal/styles';
import logos from '../../../assets/logos';
import wave from '../../../assets/wave';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;
const Graphic = styled(motion.div)`
  position: relative;
  margin: 0px auto 16px;
  height: 190px;
  pointer-events: none;
  user-select: none;
`;
const GraphicBackground = styled(motion.div)`
  z-index: -1;
  position: absolute;
  inset: 0;
  top: -2px;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--body-background);
    background: radial-gradient(
      closest-side,
      var(--body-background-transparent) 18.75%,
      var(--body-background) 100%
    );
    background-size: 100%;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const logoIn = keyframes`
  0%{
    opacity:0;
    transform:scale(0) translateY(40%);
  }
  100%{
    opacity:1;
    transform:none;
  }
`;
const floatRotateA = keyframes`
  0%,100%{ transform:none; }
  50%{ transform:scale(1.05) translateY(-5%) rotate(-6deg); }
`;
const floatRotateB = keyframes`
  0%,100%{ transform:none; }
  50%{ transform:scale(0.96) translateY(2%) rotate(-2deg); }
`;
const floatRotateC = keyframes`
  0%,100%{ transform:none; }
  50%{ transform:scale(0.96) translateY(2%) rotate(2deg); }
`;
const floatRotateD = keyframes`
  0%,100%{ transform:none; }
  50%{ transform:scale(0.96) translateY(4%) rotate(6deg); }
`;
const floatRotateE = keyframes`
  0%,100%{ transform:none; }
  50%{ transform:scale(0.96) translateY(6%) rotate(-2deg); }
`;
const GraphicLogos = styled(motion.div)``;
const LogoWrapper = styled(motion.div)`
  position: absolute;
  inset: 0;
  animation: cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  animation-delay: inherit;
`;
const LogoGraphic = styled(motion.div)`
  position: absolute;
  overflow: hidden;
  height: 58px;
  width: 58px;
  border-radius: 18px;
  background: var(--body-background-secondary);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 20px 0 rgba(0, 0, 0, 0.03);

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const GraphicLogo = styled(motion.div)`
  position:absolute;
  inset:0;
  will-change: transform;
  
  animation: ${logoIn} 1650ms cubic-bezier(0.19, 1, 0.22, 1) both;
  &:nth-child(1){ z-index:2; animation-delay:0ms;  ${LogoWrapper}{ animation-name:${floatRotateA}; animation-duration:4000ms; } }
  &:nth-child(2){ z-index:1; animation-delay:120ms; ${LogoWrapper}{ animation-name:${floatRotateB}; animation-duration:4300ms; } }
  &:nth-child(3){ z-index:1; animation-delay:60ms; ${LogoWrapper}{ animation-name:${floatRotateC}; animation-duration:4100ms; } }
  &:nth-child(4){ z-index:1; animation-delay:180ms; ${LogoWrapper}{ animation-name:${floatRotateD}; animation-duration:4600ms; } }
  &:nth-child(5){ z-index:1; animation-delay:260ms; ${LogoWrapper}{ animation-name:${floatRotateE}; animation-duration:4800ms; } }
  @media (prefers-reduced-motion) {
    animation-name: none;
  }
  &:nth-child(1) ${LogoGraphic}{
    top: 50%;
    left: 50%;
    width: 72px;
    height: 72px;
    transform: translate(-50%, -50%) rotate(4.28deg);
  }
  &:nth-child(2) ${LogoGraphic}{
    top: 21.5%;
    left: 21%;
    transform: translate(-50%, -50%) rotate(-4.6deg);
  }
  &:nth-child(3) ${LogoGraphic}{
    top: 14%;
    right: 2%;
    transform: translate(-50%, -50%) rotate(3.95deg);
  }
  &:nth-child(4) ${LogoGraphic}{
    top: 76%;
    left: 22.5%;
    transform: translate(-50%, -50%) rotate(4.82deg);
  }
  &:nth-child(5) ${LogoGraphic}{
    top: 79%;
    right: 3%;
    transform: translate(-50%, -50%) rotate(-7.51deg);
  }
}`;

const ButtonAnchor = styled(motion.a)`
  --background: var(--body-background-secondary);
  appearance: none;
  cursor: pointer;
  user-select: none;
  min-width: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  height: 48px;
  margin: 0;
  padding: 0 32px;
  text-decoration: none;
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  color: var(--body-color);
  background: var(--background);
  white-space: nowrap;
  transition: box-shadow 100ms ease, background-color 100ms ease;
  box-shadow: 0 0 0 0 var(--background);

  &:hover {
    --background: var(--body-background-secondary-hover);
    box-shadow: 0 0 0 2px var(--background);
  }
  &:active {
    box-shadow: 0 0 0 1px var(--background);
  }
`;

const Introduction: React.FC = () => {
  return (
    <Container>
      <ModalHeading>Get a Wallet</ModalHeading>
      <Graphic>
        <GraphicLogos>
          <GraphicLogo>
            <LogoWrapper>
              <LogoGraphic>{logos.Coinbase}</LogoGraphic>
            </LogoWrapper>
          </GraphicLogo>
          <GraphicLogo>
            <LogoWrapper>
              <LogoGraphic>{logos.MetaMask}</LogoGraphic>
            </LogoWrapper>
          </GraphicLogo>
          <GraphicLogo>
            <LogoWrapper>
              <LogoGraphic>{logos.Trust}</LogoGraphic>
            </LogoWrapper>
          </GraphicLogo>
          <GraphicLogo>
            <LogoWrapper>
              <LogoGraphic>{logos.Argent}</LogoGraphic>
            </LogoWrapper>
          </GraphicLogo>
          <GraphicLogo>
            <LogoWrapper>
              <LogoGraphic>{logos.imToken}</LogoGraphic>
            </LogoWrapper>
          </GraphicLogo>
        </GraphicLogos>
        <GraphicBackground
          animate={{
            opacity: [0, 1],
            scale: [0.9, 1],
            transition: { delay: 0.1, duration: 1 },
          }}
        >
          {wave}
        </GraphicBackground>
      </Graphic>
      <ModalContent style={{ paddingBottom: 27 }}>
        <ModalH1>Start Exploring Web3</ModalH1>
        <ModalBody>
          Your wallet is the gateway to all things Ethereum, the magical
          technology that makes it possible to explore web3.
        </ModalBody>
      </ModalContent>
      <ButtonAnchor
        href="https://ethereum.org/en/wallets/find-wallet/#main-content"
        target="_blank"
        rel="noopener noreferrer"
      >
        Choose Your First Wallet &rarr;
      </ButtonAnchor>
    </Container>
  );
};

export default Introduction;
