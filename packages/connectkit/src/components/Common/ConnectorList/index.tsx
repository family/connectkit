import { useContext, routes } from '../../ConnectKit';

import {
  ConnectorsContainer,
  ConnectorButton,
  ConnectorLabel,
  ConnectorIcon,
  RecentlyUsedTag,
} from './styles';

import { isInjectedConnector } from '../../../utils';
import { OtherWallets } from '../../../assets/logos';

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

const ConnectorList = ({
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
      <ConnectorsContainer $mobile={isMobile}>
        {walletsToDisplay.length === 0 && <>No wallets found</>}
        {walletsToDisplay.map((wallet) => {
          const logos = wallet.logos;

          let logo = logos.connectorButton ?? logos.default;
          if (wallet.installed && logos.appIcon) {
            logo = logos.appIcon;
          }

          const name = isMobile ? wallet.shortName ?? wallet.name : wallet.name;

          return (
            <ConnectorButton
              key={wallet.id}
              onClick={() => onClickHandler(wallet)}
            >
              <ConnectorIcon>{logo}</ConnectorIcon>
              <ConnectorLabel>
                {name}
                {!context.options?.hideRecentBadge &&
                  lastConnectorId === wallet.id && (
                    <RecentlyUsedTag>
                      <span>Recent</span>
                    </RecentlyUsedTag>
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
            </ConnectorLabel>
          </ConnectorButton>
        )}
      </ConnectorsContainer>
    </ScrollArea>
  );
};

export default ConnectorList;
