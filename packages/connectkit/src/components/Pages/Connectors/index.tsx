import React, { useEffect } from 'react';
import { useContext, routes } from '../../ConnectKit';
import supportedConnectors from '../../../constants/supportedConnectors';
import {
  isMetaMask,
  isCoinbaseWallet,
  isWalletConnectConnector,
  isInjectedConnector,
  isMetaMaskConnector,
  isTrust,
} from './../../../utils';

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
  MobileConnectorsContainer,
  MobileConnectorButton,
  MobileConnectorLabel,
  MobileConnectorIcon,
  InfoBox,
  InfoBoxButtons,
  ConnectorRecentlyUsed,
} from './styles';

import { isMobile, isAndroid } from '../../../utils';

import Button from '../../Common/Button';
import useDefaultWallets from '../../../wallets/useDefaultWallets';
import { Connector } from 'wagmi';
import useLocales from '../../../hooks/useLocales';
import { useLastConnector } from '../../../hooks/useLastConnector';
import { useWalletConnectUri } from '../../../hooks/connectors/useWalletConnectUri';

const Wallets: React.FC = () => {
  const context = useContext();
  const locales = useLocales({});
  const mobile = isMobile();

  const { uri: wcUri } = useWalletConnectUri({ enabled: mobile });
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

  /**
   * Some injected connectors pretend to be metamask, this helps avoid that issue.
   */

  const shouldShowInjectedConnector = (connector?: any) => {
    // Only display if an injected connector is detected
    const { ethereum } = window;

    const needsInjectedWalletFallback =
      (typeof window !== 'undefined' &&
        ethereum &&
        !isMetaMask() &&
        !isCoinbaseWallet()) ||
      (connector && isTrust() && /trust wallet/i.test(connector?.name));
    //!ethereum?.isBraveWallet; // TODO: Add this line when Brave is supported

    return needsInjectedWalletFallback;
  };

  const wallets = useDefaultWallets();

  const findInjectedConnectorInfo = (name: string) => {
    let walletList = name.split(/[(),]+/);
    walletList.shift(); // remove "Injected" from array
    walletList = walletList.map((x) => x.trim());

    const hasWalletLogo = walletList.filter((x) => {
      const a = wallets.map((wallet: any) => wallet.name).includes(x);
      if (a) return x;
      return null;
    });
    if (hasWalletLogo.length === 0) {
      const installedWallets = wallets.filter((wallet) => wallet.installed);
      if (installedWallets.length === 1) {
        // Fallback for when there is only one wallet installed
        return installedWallets[0];
      } else {
        // Fallback for when there are multiple wallets installed
        return null;
      }
    }

    const foundInjector = wallets.filter(
      (wallet: any) => wallet.installed && wallet.name === hasWalletLogo[0]
    )[0];

    return foundInjector;
  };

  return (
    <PageContent style={{ width: 312 }}>
      {mobile ? (
        <>
          <MobileConnectorsContainer>
            {connectors.map((connector) => {
              const info = supportedConnectors.filter(
                (c) => c.id === connector.id
              )[0];
              if (!info) return null;

              let logos = info.logos;
              let name = info.shortName ?? info.name ?? connector.name;

              if (isInjectedConnector(info.id)) {
                if (!shouldShowInjectedConnector()) return null;

                const foundInjector = findInjectedConnectorInfo(connector.name);
                if (foundInjector) {
                  logos = foundInjector.logos;
                  name = foundInjector.name.replace(' Wallet', '');
                }
              }

              if (isWalletConnectConnector(info.id)) {
                name =
                  context.options?.walletConnectName ?? locales.otherWallets;
              }

              return (
                <MobileConnectorButton
                  key={`m-${connector.id}`}
                  //disabled={!connector.ready}
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
                  }}
                >
                  <MobileConnectorIcon>
                    {logos.mobile ??
                      logos.appIcon ??
                      logos.connectorButton ??
                      logos.default}
                  </MobileConnectorIcon>
                  <MobileConnectorLabel>{name}</MobileConnectorLabel>
                </MobileConnectorButton>
              );
            })}
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
          <ConnectorsContainer>
            {connectors.map((connector) => {
              const info = supportedConnectors.filter(
                (c) => c.id === connector.id
              )[0];
              if (!info) return null;

              let logos = info.logos;

              let name = info.name ?? connector.name;
              if (isWalletConnectConnector(info.id)) {
                name =
                  context.options?.walletConnectName ?? locales.otherWallets;
              }

              if (isInjectedConnector(info.id)) {
                if (!shouldShowInjectedConnector(connector)) return null;

                const foundInjector = findInjectedConnectorInfo(connector.name);
                if (foundInjector) {
                  logos = foundInjector.logos;
                  name = foundInjector.name;
                }
              }

              let logo = logos.connectorButton ?? logos.default;
              if (info.extensionIsInstalled && logos.appIcon) {
                if (info.extensionIsInstalled()) {
                  logo = logos.appIcon;
                }
              }
              return (
                <ConnectorButton
                  key={connector.id}
                  disabled={context.route !== routes.CONNECTORS}
                  onClick={() => {
                    context.setRoute(routes.CONNECT);
                    context.setConnector(connector.id);
                  }}
                >
                  <ConnectorIcon>{logo}</ConnectorIcon>
                  <ConnectorLabel>
                    {name}
                    {!context.options?.hideRecentBadge &&
                      lastConnectorId === connector.id && (
                        <ConnectorRecentlyUsed>
                          <span>Recent</span>
                        </ConnectorRecentlyUsed>
                      )}
                  </ConnectorLabel>
                </ConnectorButton>
              );
            })}
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
