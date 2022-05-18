import React from 'react';
import {
  Container,
  Graphic,
  LogoGroup,
  Logo,
  FloatWrapper,
  LogoPosition,
  LogoInner,
  LogoGraphic,
  GraphicBackground,
  RotateWrapper,
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
        <LogoGroup>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>{logos.Coinbase}</LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>{logos.MetaMask}</LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>{logos.Trust}</LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>{logos.Argent}</LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>{logos.imToken}</LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
        </LogoGroup>
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
