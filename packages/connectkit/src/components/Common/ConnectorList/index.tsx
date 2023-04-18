import { useContext, routes } from '../../ConnectKit';

import {
  ConnectorsContainer,
  ConnectorButton,
  ConnectorLabel,
  ConnectorIcon,
  RecentlyUsedTag,
  NoResults,
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
  const { lastConnectorId } = useLastConnector();

  const filteredWallets = filterWallets(wallets);
  const sortedWallets = [
    ...filteredWallets.filter((w) => w.id === lastConnectorId),
    ...filteredWallets.filter((w) => w.id !== lastConnectorId),
  ];

  const walletsToDisplay: WalletProps[] = sortedWallets.slice(start, end);
  const otherWallets: WalletProps[] = sortedWallets.slice(end);

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
      {walletsToDisplay.length === 0 && <NoResults>No wallets found</NoResults>}
      <ConnectorsContainer
        $mobile={isMobile}
        $totalResults={
          walletsToDisplay.length + (otherWallets.length !== 0 ? 1 : 0)
        }
      >
        {walletsToDisplay.map((wallet) => {
          const logos = wallet.logos;

          const logo =
            (isMobile ? logos.mobile : undefined) ??
            (wallet.installed ? logos.appIcon : undefined) ??
            logos.connectorButton ??
            logos.default;

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
              context.setRoute(routes.OTHERCONNECTORS);
            }}
          >
            <ConnectorIcon>
              <div
                style={
                  isMobile
                    ? {
                        padding: 5,
                        background: 'var(--ck-body-background-secondary)',
                        borderRadius: '21%',
                        boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.02)',
                      }
                    : undefined
                }
              >
                <OtherWallets
                  wallets={otherWallets.map((w) => w.logos.default)}
                />
              </div>
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
