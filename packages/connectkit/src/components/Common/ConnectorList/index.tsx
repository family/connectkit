import { useContext, routes } from '../../ConnectKit';

import {
  ConnectorsContainer,
  ConnectorButton,
  ConnectorLabel,
  ConnectorIcon,
  RecentlyUsedTag,
} from './styles';

import { useWallets } from '../../../hooks/useWallets';
import { useInjectedWallet } from '../../../hooks/connectors/useInjectedWallet';
import { isInjectedConnector, isWalletConnectConnector } from '../../../utils';

import { useWalletConnectUri } from '../../../hooks/connectors/useWalletConnectUri';
import { useLastConnector } from '../../../hooks/useLastConnector';
import useIsMobile from '../../../hooks/useIsMobile';

import { ScrollArea } from '../../Common/ScrollArea';
import Alert from '../Alert';

const ConnectorList = () => {
  const context = useContext();
  const isMobile = useIsMobile();

  const { uri } = useWalletConnectUri();
  const { lastConnectorId } = useLastConnector();
  const injectedWallet = useInjectedWallet();

  const wallets = useWallets();

  const walletsToDisplay =
    context.options?.hideRecentBadge ||
    lastConnectorId === 'walletConnect-WalletConnect' // do not hoist walletconnect to top of list
      ? wallets
      : [
          // move last used wallet to top of list
          // using .filter and spread to avoid mutating original array order with .sort
          ...wallets.filter(
            (wallet) =>
              lastConnectorId ===
              `${wallet.connector.id}-${wallet.connector.name}`
          ),
          ...wallets.filter(
            (wallet) =>
              lastConnectorId !==
              `${wallet.connector.id}-${wallet.connector.name}`
          ),
        ];

  return (
    <ScrollArea mobileDirection={'horizontal'}>
      {walletsToDisplay.length === 0 && (
        <Alert error>No connectors found in ConnectKit config.</Alert>
      )}
      {walletsToDisplay.length > 0 && (
        <ConnectorsContainer
          $mobile={isMobile}
          $totalResults={walletsToDisplay.length}
        >
          {walletsToDisplay.map((wallet) => {
            const {
              id,
              name,
              shortName,
              icon,
              iconConnector,
              connector,
              createUri,
            } = wallet;

            let deeplink = isMobile ? createUri?.(uri ?? '') : undefined;

            const redirectToMoreWallets =
              isMobile && isWalletConnectConnector(id);

            if (isInjectedConnector(id) && !injectedWallet.enabled) return null;
            if (redirectToMoreWallets) deeplink = undefined; // mobile redirects to more wallets page

            const walletInfo =
              isInjectedConnector(wallet.id) && injectedWallet.enabled
                ? // && injectedWallet.wallet.name === wallet.name
                  {
                    name: injectedWallet.wallet.name,
                    shortName:
                      injectedWallet.wallet.shortName ??
                      injectedWallet.wallet.name,
                    icon: injectedWallet.wallet.icon,
                    //iconRadius: 0,
                  }
                : {
                    name: name,
                    shortName: shortName ?? name,
                    icon: iconConnector ?? icon,
                    iconRadius: wallet.id === 'walletConnect' ? 0 : undefined,
                  };

            const ButtonInner = ({
              disabled = false,
            }: {
              disabled?: boolean;
            }) => (
              <ConnectorButton
                as={deeplink ? 'a' : undefined}
                href={deeplink ? deeplink : undefined}
                disabled={disabled || context.route !== routes.CONNECTORS}
                onClick={
                  deeplink
                    ? undefined
                    : () => {
                        if (redirectToMoreWallets) {
                          context.setRoute(routes.MOBILECONNECTORS);
                        } else {
                          context.setRoute(routes.CONNECT);
                          context.setConnector({ id: id, name: name });
                        }
                      }
                }
              >
                <ConnectorIcon
                  data-small={wallet.iconShouldShrink}
                  style={{
                    borderRadius: walletInfo.iconRadius,
                  }}
                >
                  {walletInfo.icon}
                </ConnectorIcon>
                <ConnectorLabel>
                  {isMobile ? walletInfo.shortName : walletInfo.name}
                  {!context.options?.hideRecentBadge &&
                    lastConnectorId === `${connector.id}-${connector.name}` && (
                      <RecentlyUsedTag>
                        <span>Recent</span>
                      </RecentlyUsedTag>
                    )}
                </ConnectorLabel>
              </ConnectorButton>
            );
            /*
            if (!connector.ready && injectedWallet.enabled) {
              return (
                <Tooltip
                  key={id}
                  xOffset={18}
                  message={
                    <div style={{ width: 230, padding: '6px 4px' }}>
                      {name} Unavailable as {injectedWallet?.wallet?.name} is
                      installed. Disable {injectedWallet?.wallet?.name} to
                      connect with {name}.
                    </div>
                  }
                  delay={0}
                >
                  <ButtonInner disabled />
                </Tooltip>
              );
            }
            */
            return <ButtonInner key={id} />;
          })}
        </ConnectorsContainer>
      )}
    </ScrollArea>
  );
};

export default ConnectorList;
