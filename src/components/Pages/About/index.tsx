import React from 'react';
import {
  Sections,
  Section,
  Heading,
  TokenGraphic,
  Tokens,
  Token,
} from './styles';

import localizations, { localize } from '../../../constants/localizations';
import { useContext } from '../../ConnectKit';

import {
  PageContent,
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeading,
} from '../../Common/Modal/styles';

import Button from '../../Common/Button';
import chains from '../../../assets/chains';
import keychain from '../../../assets/keychain';

const About: React.FC = () => {
  const localizeText = (text: string) => {
    return localize(text, {
      //CONNECTORNAME: connector.name,
    });
  };
  const context = useContext();
  const copy = localizations[context.lang].aboutScreen;
  return (
    <PageContent style={{ width: 314 }}>
      <ModalHeading>{localizeText(copy.heading)}</ModalHeading>
      <ModalContent style={{ paddingBottom: 24 }}>
        <Sections>
          <Section>
            <TokenGraphic>
              <Tokens>
                <Token>{chains.Ethereum}</Token>
                <Token>{chains.Arbitrum}</Token>
              </Tokens>
              <Tokens>
                <Token>{chains.Polygon}</Token>
                <Token>{chains.Optimism}</Token>
              </Tokens>
            </TokenGraphic>
            <ModalBody>
              <Heading>{localizeText(copy.a_h1)}</Heading>
              <div>{localizeText(copy.a_p)}</div>
            </ModalBody>
          </Section>
          <Section>
            <TokenGraphic>{keychain}</TokenGraphic>
            <ModalBody>
              <Heading>{localizeText(copy.b_h1)}</Heading>
              <div>{localizeText(copy.b_p)}</div>
            </ModalBody>
          </Section>
        </Sections>
      </ModalContent>
      <Button href={copy.ctaUrl}>{localizeText(copy.ctaText)}</Button>
    </PageContent>
  );
};

export default About;
