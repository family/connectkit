import React, { useEffect } from 'react';
import { useContext, routes } from '../../ConnectKit';
import { isMetaMaskConnector } from './../../../utils';

import { useConnect } from '../../../hooks/useConnect';

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
  ConnectorsContainer,
  ConnectorButton,
  ConnectorLabel,
  ConnectorIcon,
  InfoBox,
  InfoBoxButtons,
  ConnectorRecentlyUsed,
  ConnectorsContainerInner,
} from './styles';

import { isMobile, isAndroid } from '../../../utils';

import Button from '../../Common/Button';
import { useWallets } from '../../../wallets/useDefaultWallets';
import { Connector } from 'wagmi';
import useLocales from '../../../hooks/useLocales';
import { useLastConnector } from '../../../hooks/useLastConnector';
import { useWalletConnectUri } from '../../../hooks/connectors/useWalletConnectUri';

const Wallets: React.FC = () => {
  const context = useContext();
  const locales = useLocales({});
  const mobile = isMobile();

  const wallets = useWallets();

  const { uri: wcUri } = useWalletConnectUri();
  const { connectAsync, connectors } = useConnect();
  const { lastConnectorId } = useLastConnector();

  const openDefaultConnect = async (connector: Connector) => {
    // @TODO: use the MetaMask config
    if (isMetaMaskConnector(connector.id) && mobile) {
      const uri = isAndroid()
        ? wcUri!
        : `https://metamask.app.link/wc?uri=${encodeURIComponent(wcUri!)}`;
      if (uri) window.location.href = uri;
    } else {
      try {
        await connectAsync({ connector: connector });
      } catch (err) {
        context.displayError(
          'Async connect error. See console for more details.',
          err
        );
      }
    }
  };
  useEffect(() => {}, [mobile]);

  return (
    <PageContent style={{ width: 312 }}>
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
          {context.options?.disclaimer && (
            <Disclaimer style={{ visibility: 'hidden', pointerEvents: 'none' }}>
              <div>{context.options?.disclaimer}</div>
            </Disclaimer>
          )}
        </>
      ) : (
        <>
          <ConnectorsContainer>
            <ConnectorsContainerInner>
              {wallets.map((wallet) => {
                const logos = wallet.logos;

                let logo = logos.connectorButton ?? logos.default;
                if (wallet.installed && logos.appIcon) {
                  logo = logos.appIcon;
                }

                //if (!wallet.installed && !wallet.scannable) return null;
                return (
                  <ConnectorButton
                    key={wallet.id}
                    disabled={context.route !== routes.CONNECTORS}
                    onClick={() => {
                      context.setRoute(routes.CONNECT);
                      context.setConnector(wallet.id);
                    }}
                  >
                    <ConnectorIcon>{logo}</ConnectorIcon>
                    <ConnectorLabel>
                      {wallet.name}
                      {!context.options?.hideRecentBadge &&
                        lastConnectorId === wallet.id && (
                          <ConnectorRecentlyUsed>
                            <span>Recent</span>
                          </ConnectorRecentlyUsed>
                        )}
                    </ConnectorLabel>
                  </ConnectorButton>
                );
              })}
            </ConnectorsContainerInner>
          </ConnectorsContainer>

          {!context.options?.hideNoWalletCTA && (
            <LearnMoreContainer>
              <LearnMoreButton
                onClick={() => context.setRoute(routes.ONBOARDING)}
              >
                <WalletIcon /> {locales.connectorsScreen_newcomer}
              </LearnMoreButton>
            </LearnMoreContainer>
          )}
          {context.options?.disclaimer && (
            <Disclaimer style={{ visibility: 'hidden', pointerEvents: 'none' }}>
              <div>{context.options?.disclaimer}</div>
            </Disclaimer>
          )}
        </>
      )}
    </PageContent>
  );
};

export default Wallets;
