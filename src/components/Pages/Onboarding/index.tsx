import React from 'react';
import {
  Container,
  Graphic,
  GraphicLogos,
  GraphicLogo,
  LogoWrapper,
  LogoGraphic,
  GraphicBackground,
} from './styles';

import localizations, { localize } from '../../../constants/localizations';
import { useContext } from '../../ConnectKit';

import {
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeading,
} from '../../Common/Modal/styles';
import logos from '../../../assets/logos';
import wave from '../../../assets/wave';

import Button from '../../Common/Button';

const Introduction: React.FC = () => {
  const localizeText = (text: string) => {
    return localize(text, {
      //CONNECTORNAME: connector.name,
    });
  };
  const context = useContext();
  const copy = localizations[context.lang].onboardingScreen;
  return (
    <Container>
      <ModalHeading>{localizeText(copy.heading)}</ModalHeading>
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
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {wave}
        </GraphicBackground>
      </Graphic>
      <ModalContent style={{ paddingBottom: 24 }}>
        <ModalH1>{localizeText(copy.h1)}</ModalH1>
        <ModalBody>{localizeText(copy.p)}</ModalBody>
      </ModalContent>
      <Button href={copy.ctaUrl} arrow>
        {localizeText(copy.ctaText)}
      </Button>
    </Container>
  );
};

export default Introduction;
