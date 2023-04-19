import React from 'react';
import { useContext, routes } from '../../ConnectKit';

import {
  PageContent,
  ModalH1,
  ModalBody,
  ModalContent,
  Disclaimer,
} from '../../Common/Modal/styles';
import WalletIcon from '../../../assets/wallet';

import {
  LearnMoreContainer,
  LearnMoreButton,
  InfoBox,
  InfoBoxButtons,
} from './styles';

import { isInjectedConnector } from '../../../utils';

import Button from '../../Common/Button';
import { useWallets } from '../../../wallets/useDefaultWallets';
import useLocales from '../../../hooks/useLocales';
import useIsMobile from '../../../hooks/useIsMobile';
import {
  detectInjectedConnector,
  shouldShowInjectedConnector,
} from '../../../utils/injectedWallet';
import ConnectorList from '../../Common/ConnectorList';

export const filterWallets = (wallets: any[]) => {
  const injected = wallets.find((w) => isInjectedConnector(w.id));
  const others = wallets.filter((w) => !isInjectedConnector(w.id));

  if (shouldShowInjectedConnector() && injected) {
    const injectedConnector = detectInjectedConnector();
    if (injectedConnector) {
      injected.name = injectedConnector.name;
      injected.shortName = injectedConnector.shortName;
      injected.logos = injectedConnector.logos;
    }
    return [injected, ...others];
  }
  return [...others];
};

const Wallets: React.FC = () => {
  const context = useContext();
  const locales = useLocales({});
  const mobile = useIsMobile();

  const wallets = useWallets();

  return (
    <PageContent style={{ width: 312 }}>
      <ConnectorList wallets={wallets} />
      {mobile ? (
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
    </PageContent>
  );
};

export default Wallets;
