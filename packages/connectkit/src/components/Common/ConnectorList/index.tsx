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
import Tooltip from '../Tooltip';
import Alert from '../Alert';

const ConnectorList = () => {
  const context = useContext();
  const isMobile = useIsMobile();

  const { uri } = useWalletConnectUri();
  const { lastConnectorId } = useLastConnector();
  const injectedWallet = useInjectedWallet();

  const wallets = useWallets();
  const walletsToDisplay = wallets;

  return (
    <ScrollArea>
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
                  style={{
                    borderRadius: wallet.id === 'walletConnect' ? 0 : undefined,
                  }}
                >
                  {iconConnector ?? icon}
                </ConnectorIcon>
                <ConnectorLabel>
                  {isMobile ? shortName ?? name : name}
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
