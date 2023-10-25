import { useContext, routes } from '../../ConnectKit';

import {
  ConnectorsContainer,
  ConnectorButton,
  ConnectorLabel,
  ConnectorIcon,
  RecentlyUsedTag,
  NoResults,
} from './styles';

import { isInjectedConnector, isMobile as useIsMobile } from '../../../utils';

import { useLastConnector } from '../../../hooks/useLastConnector';
import { ScrollArea } from '../../Common/ScrollArea';
import Tooltip from '../Tooltip';
import { useWallets } from '../../../hooks/useWallets';

const ConnectorList = () => {
  const context = useContext();
  const isMobile = useIsMobile();

  const { lastConnectorId } = useLastConnector();

  const wallets = useWallets();
  const walletsToDisplay = wallets;

  return (
    <ScrollArea>
      {walletsToDisplay.length === 0 && <NoResults>No wallets found</NoResults>}

      <ConnectorsContainer
        $mobile={isMobile}
        $totalResults={walletsToDisplay.length}
      >
        {walletsToDisplay.map((wallet) => {
          const { id, name, icon, connector } = wallet;

          const ButtonInner = ({
            disabled = false,
          }: {
            disabled?: boolean;
          }) => (
            <ConnectorButton
              disabled={disabled || context.route !== routes.CONNECTORS}
              onClick={() => {
                context.setRoute(routes.CONNECT);
                context.setConnector({ id: id, name: name });
              }}
            >
              <ConnectorIcon>{icon}</ConnectorIcon>
              <ConnectorLabel>
                {name}
                {!context.options?.hideRecentBadge &&
                  lastConnectorId === connector.id && (
                    <RecentlyUsedTag>
                      <span>Recent</span>
                    </RecentlyUsedTag>
                  )}
              </ConnectorLabel>
            </ConnectorButton>
          );

          if (!connector.ready) {
            return (
              <Tooltip
                key={id}
                xOffset={18}
                message={
                  <div style={{ width: 230, padding: '6px 4px' }}>
                    {name} Unavailable as {connector.name} is installed. Disable{' '}
                    {connector.name} to connect with {name}.
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
