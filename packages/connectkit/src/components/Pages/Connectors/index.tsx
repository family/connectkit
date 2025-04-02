import React from 'react';
import { useContext, routes } from '../../ConnectKit';

import {
  LearnMoreContainer,
  LearnMoreButton,
  InfoBox,
  InfoBoxButtons,
  Container,
} from './styles';
import {
  PageContent,
  Disclaimer,
  ModalContent,
  ModalH1,
  ModalBody,
} from '../../Common/Modal/styles';
import WalletIcon from '../../../assets/wallet';

import useLocales from '../../../hooks/useLocales';
import ConnectorList from '../../Common/ConnectorList';
import useIsMobile from '../../../hooks/useIsMobile';
import Button from '../../Common/Button';
import {
  useFamilyAccountsConnector,
  useFamilyConnector,
} from '../../../hooks/useConnectors';
import { OrDivider } from '../../Common/Modal';
import { FamilyAccountsButton } from '../../Common/FamilyAccountsButton';
import { isFamily } from '../../../utils/wallets';

const Wallets: React.FC = () => {
  const context = useContext();
  const locales = useLocales({});

  const isMobile = useIsMobile();
  const familyConnector = useFamilyConnector();
  const familyAccountsConnector = useFamilyAccountsConnector();

  return (
    <PageContent
      style={{
        width: 312,
        paddingTop: familyAccountsConnector ? 32 : undefined,
      }}
    >
      <Container>
        {familyAccountsConnector && (
          <>
            <FamilyAccountsButton
              onClick={() => {
                if (familyConnector && isFamily()) {
                  context.setConnector(familyConnector);
                } else {
                  context.setConnector(familyAccountsConnector);
                }
                context.setRoute(routes.CONNECT);
              }}
            />
            <OrDivider hideHr>{locales.orSelectWallet}</OrDivider>
          </>
        )}
        <div>
          <ConnectorList />
          {isMobile ? (
            <>
              <InfoBox>
                <ModalContent style={{ padding: 0, textAlign: 'left' }}>
                  <ModalH1 $small>{locales.connectorsScreen_h1}</ModalH1>
                  <ModalBody>{locales.connectorsScreen_p}</ModalBody>
                </ModalContent>
                <InfoBoxButtons>
                  {!context.options?.hideQuestionMarkCTA && (
                    <Button
                      variant={'tertiary'}
                      onClick={() => context.setRoute(routes.ABOUT)}
                    >
                      {locales.learnMore}
                    </Button>
                  )}
                  {!context.options?.hideNoWalletCTA && (
                    <Button
                      variant={'tertiary'}
                      onClick={() => context.setRoute(routes.ONBOARDING)}
                    >
                      {locales.getWallet}
                    </Button>
                  )}
                </InfoBoxButtons>
              </InfoBox>
            </>
          ) : (
            <>
              {!context.options?.hideNoWalletCTA && (
                <LearnMoreContainer>
                  <LearnMoreButton
                    onClick={() => context.setRoute(routes.ONBOARDING)}
                  >
                    <WalletIcon /> {locales.connectorsScreen_newcomer}
                  </LearnMoreButton>
                </LearnMoreContainer>
              )}
            </>
          )}
          {context.options?.disclaimer && (
            <Disclaimer style={{ visibility: 'hidden', pointerEvents: 'none' }}>
              <div>{context.options?.disclaimer}</div>
            </Disclaimer>
          )}
        </div>
      </Container>
    </PageContent>
  );
};

export default Wallets;
