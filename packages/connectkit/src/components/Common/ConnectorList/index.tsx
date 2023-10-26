import { useContext, routes } from '../../ConnectKit';

import {
  ConnectorsContainer,
  ConnectorButton,
  ConnectorLabel,
  ConnectorIcon,
  RecentlyUsedTag,
  NoResults,
} from './styles';

import { useWallets } from '../../../hooks/useWallets';
import { useInjectedWallet } from '../../../hooks/connectors/useInjectedWallet';
import { isInjectedConnector } from '../../../utils';

import { useLastConnector } from '../../../hooks/useLastConnector';
import useIsMobile from '../../../hooks/useIsMobile';

import { ScrollArea } from '../../Common/ScrollArea';
import Tooltip from '../Tooltip';
import { useWalletConnectUri } from '../../../hooks/connectors/useWalletConnectUri';

const ConnectorList = () => {
  const context = useContext();
  const isMobile = useIsMobile();

  const { lastConnectorId } = useLastConnector();
  const { uri } = useWalletConnectUri();

  const wallets = useWallets();
  const walletsToDisplay = wallets;

  const injectedWallet = useInjectedWallet();

  return (
    <ScrollArea>
      {walletsToDisplay.length === 0 && <NoResults>No wallets found</NoResults>}
      {injectedWallet.enabled && <NoResults>Injected Enabled</NoResults>}

      <ConnectorsContainer
        $mobile={isMobile}
        $totalResults={walletsToDisplay.length}
      >
        {walletsToDisplay.map((wallet) => {
          const { id, name, icon, iconConnector, connector, createUri } =
            wallet;

          const deeplink = isMobile ? createUri?.(uri ?? '') : undefined;

          if (isInjectedConnector(id) && !injectedWallet.enabled) return null;

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
                      context.setRoute(routes.CONNECT);
                      context.setConnector({ id: id, name: name });
                    }
              }
            >
              <ConnectorIcon>{iconConnector ?? icon}</ConnectorIcon>
              <ConnectorLabel>
                {name}
                {!context.options?.hideRecentBadge &&
                  lastConnectorId === `${connector.id}-${connector.name}` && (
                    <RecentlyUsedTag>
                      <span>Recent</span>
                    </RecentlyUsedTag>
                  )}
              </ConnectorLabel>
            </ConnectorButton>
          );

          if (!connector.ready && injectedWallet.enabled) {
            return (
              <Tooltip
                key={id}
                xOffset={18}
                message={
                  <div style={{ width: 230, padding: '6px 4px' }}>
                    {name} Unavailable as {injectedWallet?.wallet?.name} is
                    installed. Disable {injectedWallet?.wallet?.name} to connect
                    with {name}.
                  </div>
                }
                delay={0}
              >
                <ButtonInner disabled />
              </Tooltip>
            );
          }
          return <ButtonInner key={id} />;
        })}
      </ConnectorsContainer>
    </ScrollArea>
  );
};

export default ConnectorList;
