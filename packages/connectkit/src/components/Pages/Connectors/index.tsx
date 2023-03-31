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
  ConnectorsContainer,
  ConnectorButton,
  ConnectorLabel,
  ConnectorIcon,
  InfoBox,
  InfoBoxButtons,
  ConnectorRecentlyUsed,
  MobileConnectorsContainer,
  MobileConnectorButton,
  MobileConnectorIcon,
  MobileConnectorLabel,
} from './styles';

import { isMobile, isWalletConnectConnector } from '../../../utils';
import { OtherWallets } from '../../../assets/logos';

import Button from '../../Common/Button';
import { useWallets } from '../../../wallets/useDefaultWallets';
import useLocales from '../../../hooks/useLocales';
import { useLastConnector } from '../../../hooks/useLastConnector';
import { ScrollArea } from '../../Common/ScrollArea';

const Wallets: React.FC = () => {
  const context = useContext();
  const locales = useLocales({});
  const mobile = isMobile();

  const wallets = useWallets();

  const { lastConnectorId } = useLastConnector();

  return (
    <PageContent style={{ width: 312 }}>
      {mobile ? (
        <>
          <MobileConnectorsContainer>
            {wallets
              .filter((w) => w.installed)
              .map((wallet) => {
                const logos = wallet.logos;

                let logo =
                  logos.mobile ?? logos.connectorButton ?? logos.default;
                if (wallet.installed && logos.appIcon) {
                  logo = logos.appIcon;
                }

                //if (!wallet.installed && !wallet.scannable) return null;
                return (
                  <MobileConnectorButton
                    key={wallet.id}
                    disabled={context.route !== routes.CONNECTORS}
                    onClick={() => {
                      context.setRoute(routes.CONNECT);
                      context.setConnector(wallet.id);
                    }}
                    /*
                  onClick={() => {
                    if (
                      isInjectedConnector(info.id) ||
                      (isMetaMaskConnector(info.id) && isMetaMask())
                    ) {
                      context.setRoute(routes.CONNECT);
                      context.setConnector(connector.id);
                    } else if (isWalletConnectConnector(connector.id)) {
                      context.setRoute(routes.MOBILECONNECTORS);
                    } else {
                      openDefaultConnect(connector);
                    }
                  }}*/
                  >
                    <MobileConnectorIcon>{logo}</MobileConnectorIcon>
                    <MobileConnectorLabel>
                      {wallet.name}
                      {!context.options?.hideRecentBadge &&
                        lastConnectorId === wallet.id && (
                          <ConnectorRecentlyUsed>
                            <span>Recent</span>
                          </ConnectorRecentlyUsed>
                        )}
                    </MobileConnectorLabel>
                  </MobileConnectorButton>
                );
              })}
            {wallets.filter((w) => !w.installed).length && (
              <MobileConnectorButton
                disabled={context.route !== routes.CONNECTORS}
                onClick={() => {
                  context.setRoute(routes.MOBILECONNECTORS);
                }}
              >
                <MobileConnectorIcon>
                  <OtherWallets
                    wallets={wallets
                      .filter(
                        (w) => !w.installed && !isWalletConnectConnector(w.id)
                      )
                      .map((w) => {
                        const logos = w.logos;
                        return logos.connectorButton ?? logos.default;
                      })}
                  />
                </MobileConnectorIcon>
                <MobileConnectorLabel>More</MobileConnectorLabel>
              </MobileConnectorButton>
            )}
          </MobileConnectorsContainer>
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
          <ScrollArea>
            <ConnectorsContainer>
              {wallets
                .filter((w) => w.installed)
                .map((wallet) => {
                  const logos = wallet.logos;

                  let logo = logos.connectorButton ?? logos.default;
                  if (wallet.installed && logos.appIcon) {
                    logo = logos.appIcon;
                  }

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
              {wallets.filter((w) => !w.installed && w.scannable).length && (
                <ConnectorButton
                  disabled={context.route !== routes.CONNECTORS}
                  onClick={() => {
                    context.setRoute(routes.CONNECT);
                    context.setConnector('walletConnect');
                  }}
                >
                  <ConnectorIcon>
                    <OtherWallets />
                  </ConnectorIcon>
                  <ConnectorLabel>
                    Other Wallets
                    {!context.options?.hideRecentBadge &&
                      lastConnectorId === 'walletConnect' && (
                        <ConnectorRecentlyUsed>
                          <span>Recent</span>
                        </ConnectorRecentlyUsed>
                      )}
                  </ConnectorLabel>
                </ConnectorButton>
              )}
            </ConnectorsContainer>
          </ScrollArea>

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
