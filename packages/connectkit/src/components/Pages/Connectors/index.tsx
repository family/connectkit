import React from 'react';
import { useContext, routes } from '../../ConnectKit';

import { PageContent, Disclaimer } from '../../Common/Modal/styles';
import WalletIcon from '../../../assets/wallet';

import { LearnMoreContainer, LearnMoreButton } from './styles';

import useLocales from '../../../hooks/useLocales';
import ConnectorList from '../../Common/ConnectorList';

const Wallets: React.FC = () => {
  const context = useContext();
  const locales = useLocales({});

  return (
    <PageContent style={{ width: 312 }}>
      <ConnectorList />

      {!context.options?.hideNoWalletCTA && (
        <LearnMoreContainer>
          <LearnMoreButton onClick={() => context.setRoute(routes.ONBOARDING)}>
            <WalletIcon /> {locales.connectorsScreen_newcomer}
          </LearnMoreButton>
        </LearnMoreContainer>
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
