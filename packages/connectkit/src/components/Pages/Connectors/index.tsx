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

import {
  isCoinbaseWalletConnector,
  isInjectedConnector,
  isWalletConnectConnector,
} from '../../../utils';
import { OtherWallets } from '../../../assets/logos';

import Button from '../../Common/Button';
import { useWallets } from '../../../wallets/useDefaultWallets';
import useLocales from '../../../hooks/useLocales';
import { useLastConnector } from '../../../hooks/useLastConnector';
import { ScrollArea } from '../../Common/ScrollArea';
import useIsMobile from '../../../hooks/useIsMobile';
import {
  detectInjectedConnector,
  shouldShowInjectedConnector,
} from '../../../utils/injectedWallet';
import { WalletProps } from '../../../wallets/wallet';
import { useWalletConnectUri } from '../../../hooks/connectors/useWalletConnectUri';

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

export const ConnectorList = ({
  wallets,
  start = 0,
  end = 2,
}: {
  wallets: WalletProps[];
  start?: number;
  end?: number;
}) => {
  const context = useContext();
  const locales = useLocales({});

  const isMobile = useIsMobile();

  const walletsToDisplay: WalletProps[] = filterWallets(wallets).slice(
    start,
    end
  );
  const otherWallets: WalletProps[] = filterWallets(wallets).slice(end);

  const { lastConnectorId } = useLastConnector();

  const { uri: wcUri } = useWalletConnectUri();
  //const { uri: cbwUri } = useCoinbaseWalletUri({ enabled: !mobile });

  const onClickHandler = (wallet: WalletProps) => {
    if (isMobile && !wallet.installed) {
      const uri = wallet.createUri?.(wcUri!);
      if (uri) window.location.href = uri;
    } else {
      context.setRoute(routes.CONNECT);
      context.setConnector(wallet.id);
    }
  };

  return (
    <ScrollArea>
      <ConnectorsContainer>
        {walletsToDisplay.length === 0 && <>No wallets found</>}
        {walletsToDisplay.map((wallet) => {
          const logos = wallet.logos;

          let logo = logos.connectorButton ?? logos.default;
          if (wallet.installed && logos.appIcon) {
            logo = logos.appIcon;
          }

          return (
            <ConnectorButton
              key={wallet.id}
              onClick={() => onClickHandler(wallet)}
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

        {otherWallets.length !== 0 && (
          <ConnectorButton
            onClick={() => {
              context.setRoute(routes.MOBILECONNECTORS);
            }}
          >
            <ConnectorIcon>
              <OtherWallets
                wallets={otherWallets.map((w) => w.logos.default)}
              />
            </ConnectorIcon>
            <ConnectorLabel>
              {context.options?.walletConnectName ?? locales.otherWallets}
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
  );
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
          {context.options?.disclaimer && (
            <Disclaimer style={{ visibility: 'hidden', pointerEvents: 'none' }}>
              <div>{context.options?.disclaimer}</div>
            </Disclaimer>
          )}
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
