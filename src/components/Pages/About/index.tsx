import React from 'react';
import { Sections, Section, Heading, TokenGraphic } from './styles';

import localizations, { localize } from '../../../constants/localizations';
import { useContext } from '../../ConnectKit';

import {
  PageContent,
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeading,
  ModalHeadingBlock,
} from '../../Common/Modal/styles';

import Button from '../../Common/Button';
import Tokens from '../../../assets/tokens';
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
    <PageContent style={{ width: 312 }}>
      {/* <ModalHeading>{localizeText(copy.heading)}</ModalHeading> */}
      <ModalHeadingBlock />
      <ModalContent style={{ paddingBottom: 14 }}>
        <Sections>
          <Section>
            <TokenGraphic>
              <Tokens
                theme={context.theme}
                style={{ position: 'relative', top: -6 }}
              />
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
      <Button href={copy.ctaUrl} arrow>
        {localizeText(copy.ctaText)}
      </Button>
    </PageContent>
  );
};

export default About;
