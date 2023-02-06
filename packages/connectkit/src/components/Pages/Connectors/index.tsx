import React, { useEffect } from 'react';
import { useContext, routes } from '../../ConnectKit';
import supportedConnectors from '../../../constants/supportedConnectors';
import { isMetaMask, isCoinbaseWallet } from './../../../utils';

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
} from './styles';

import { isMobile } from '../../../utils';

import Button from '../../Common/Button';
import useDefaultWallets from '../../../wallets/useDefaultWallets';
import { Connector } from 'wagmi';
import useLocales from '../../../hooks/useLocales';

import { useWalletConnectConnector } from '../../../hooks/connectors/useWalletConnectConnector';
//import { useMetaMaskConnector } from '../../../hooks/connectors/useMetaMaskConnector';
import { useCoinbaseWalletConnector } from '../../../hooks/connectors/useCoinbaseWalletConnector';
import { useInjectedConnector } from '../../../hooks/connectors/useInjectedConnector';
import { useWalletConnectUri } from '../../../hooks/useWalletConnectUri';
import { metaMask } from '../../../wallets/connectors/metaMask';
import { useConnectors } from '../../../hooks/useConnectors';
import { useConnect } from '../../../hooks/useConnect';

const Wallets: React.FC = () => {
  const context = useContext();

  const locales = useLocales({});
  const mobile = isMobile();

  const { uri } = useWalletConnectUri();
  //const { connector: mmConnector } = useMetaMaskConnector();
  const { connector: wcConnector } = useWalletConnectConnector({});
  const { connector: cbwConnector } = useCoinbaseWalletConnector();
  const { connector: injectedConnector } = useInjectedConnector();

  const connectors = useConnectors();
  const { connectAsync } = useConnect();

  const openDefaultConnect = async (id: string) => {
    let connector: Connector | undefined;
    switch (id) {
      case 'walletConnect':
        context.setRoute(routes.MOBILECONNECTORS);
        break;
      case 'metaMask':
        connector = wcConnector;
        break;
      case 'coinbaseWallet':
        connector = cbwConnector;
        break;
      case 'injected':
        connector = injectedConnector;
        break;
    }

    if (!connector) return;

    if (id === 'metaMask' && mobile) {
      const deeplink = metaMask().createUri?.(uri as string);
      window.location.href = deeplink as string;
      //} else if (id === 'coinbaseWallet' && mobile) {
      //  const deeplink = coinbaseWallet().createUri?.(uri as string);
      //  window.location.href = deeplink as string;
    } else {
      try {
        await connectAsync({ connector });
      } catch (err) {
        context.debug(
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

  const shouldShowInjectedConnector = () => {
    // Only display if an injected connector is detected
    const { ethereum } = window;

    const needsInjectedWalletFallback =
      typeof window !== 'undefined' &&
      ethereum &&
      !isMetaMask() &&
      !isCoinbaseWallet();
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
    if (hasWalletLogo.length === 0) return null;

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

              if (info.id === 'injected') {
                if (!shouldShowInjectedConnector()) return null;

                const foundInjector = findInjectedConnectorInfo(connector.name);
                if (foundInjector) {
                  logos = foundInjector.logos;
                  name = foundInjector.name.replace(' Wallet', '');
                }
              }

              if (info.id === 'walletConnect') {
                name =
                  context.options?.walletConnectName ?? locales.otherWallets;
              }

              return (
                <MobileConnectorButton
                  key={`m-${connector.id}`}
                  //disabled={!connector.ready}
                  onClick={() => {
                    if (
                      info.id === 'injected' ||
                      (info.id === 'metaMask' && isMetaMask()) ||
                      (info.id === 'coinbaseWallet' && isCoinbaseWallet())
                    ) {
                      context.setRoute(routes.CONNECT);
                      context.setConnector(connector.id);
                    } else {
                      openDefaultConnect(connector.id);
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
              if (info.id === 'walletConnect') {
                name =
                  context.options?.walletConnectName ?? locales.otherWallets;
              }

              if (info.id === 'injected') {
                if (!shouldShowInjectedConnector()) return null;

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
                  <ConnectorLabel>{name}</ConnectorLabel>
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
