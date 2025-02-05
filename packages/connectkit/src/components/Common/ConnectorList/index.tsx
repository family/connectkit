import { useFortKit, routes } from '../../FortKit';

import {
  ConnectorsContainer,
  ConnectorButton,
  ConnectorLabel,
  ConnectorIcon,
  RecentlyUsedTag,
} from './styles';

import { useWeb3 } from '../../contexts/web3';

import useIsMobile from '../../../hooks/useIsMobile';
import { ScrollArea } from '../../Common/ScrollArea';
import Alert from '../Alert';

import { WalletProps, useWallets } from '../../../wallets/useWallets';
import {
  detectBrowser,
  isCoinbaseWalletConnector,
  isWalletConnectConnector,
} from '../../../utils';
import { useLastConnector } from '../../../hooks/useLastConnector';
import { useConnect } from '../../../hooks/useConnect';
import { Connector } from 'wagmi';
import { useOpenfort } from '../../../openfort/OpenfortProvider';
import Button from '../Button';

const openfortWalletId = 'xyz.openfort';

const ConnectorList = () => {
  const context = useFortKit();
  const isMobile = useIsMobile();

  const { user } = useOpenfort();
  const wallets = useWallets();
  const { lastConnectorId } = useLastConnector();

  const walletsToDisplay =
    context.options?.hideRecentBadge || lastConnectorId === 'walletConnect' // do not hoist walletconnect to top of list
      ? wallets
      : [
        // move last used wallet to top of list
        // using .filter and spread to avoid mutating original array order with .sort
        ...wallets.filter(
          (wallet) => lastConnectorId === wallet.connector.id && wallet.id !== openfortWalletId
        ),
        ...wallets.filter(
          (wallet) => lastConnectorId !== wallet.connector.id && wallet.id !== openfortWalletId
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
          {/* {user && (
            <Button
              onClick={() => {
                context.setRoute(routes.RECOVER);
              }}
            >Create one for me</Button>
          )} */}

          {walletsToDisplay.map((wallet) =>
            <ConnectorItem
              key={wallet.id}
              wallet={wallet}
              isRecent={wallet.id === lastConnectorId}
            />
          )}
        </ConnectorsContainer>
      )}
    </ScrollArea>
  );
};

export default ConnectorList;

const ConnectorItem = ({
  wallet,
  isRecent,
}: {
  wallet: WalletProps;
  isRecent?: boolean;
}) => {
  const {
    connect: { getUri },
  } = useWeb3();
  const uri = getUri();
  const isMobile = useIsMobile();
  const context = useFortKit();

  const { connect } = useConnect();

  /*
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      const provider = await wallet.connector.getProvider();
      setReady(!!provider);
    })();
  }, [wallet, setReady]);
  */

  let deeplink =
    (!wallet.isInstalled && isMobile) ||
      (wallet.shouldDeeplinkDesktop && !isMobile)
      ? wallet.getWalletConnectDeeplink?.(uri ?? '')
      : undefined;

  const redirectToMoreWallets = isMobile && isWalletConnectConnector(wallet.id);
  // Safari requires opening popup on user gesture, so we connect immediately here
  const shouldConnectImmediately =
    (detectBrowser() === 'safari' || detectBrowser() === 'ios') &&
    isCoinbaseWalletConnector(wallet.connector.id);

  if (redirectToMoreWallets || shouldConnectImmediately) deeplink = undefined; // mobile redirects to more wallets page

  return (
    <ConnectorButton
      type="button"
      // as={deeplink ? 'a' : undefined}
      // href={deeplink ? deeplink : undefined}
      disabled={context.route !== routes.CONNECTORS}
      onClick={
        deeplink
          ? undefined
          : () => {
            if (redirectToMoreWallets) {
              context.setRoute(routes.MOBILECONNECTORS);
            } else {
              if (shouldConnectImmediately) {
                connect({ connector: wallet?.connector });
              }
              context.setRoute(routes.CONNECT);
              context.setConnector({ id: wallet.id });
            }
          }
      }
    >
      <ConnectorIcon
        data-small={wallet.iconShouldShrink}
        data-shape={wallet.iconShape}
      >
        {wallet.iconConnector ?? wallet.icon}
      </ConnectorIcon>
      <ConnectorLabel>
        {isMobile ? wallet.shortName ?? wallet.name : wallet.name}
        {!context.options?.hideRecentBadge && isRecent && (
          <RecentlyUsedTag>
            <span>Recent</span>
          </RecentlyUsedTag>
        )}
      </ConnectorLabel>
    </ConnectorButton>
  );
};
