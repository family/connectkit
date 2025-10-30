import { embeddedWalletId } from '../../../constants/openfort'
import { useConnect } from '../../../hooks/useConnect'
import { useFamilyAccountsConnector, useFamilyConnector } from '../../../hooks/useConnectors'

import useIsMobile from '../../../hooks/useIsMobile'
import { useLastConnector } from '../../../hooks/useLastConnector'
import { detectBrowser, isCoinbaseWalletConnector, isPortoConnector, isWalletConnectConnector } from '../../../utils'
import { isFamily } from '../../../utils/wallets'
import { useWagmiWallets, type WalletProps } from '../../../wallets/useWagmiWallets'
import { useWeb3 } from '../../contexts/web3'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import Alert from '../Alert'
import { ScrollArea } from '../ScrollArea'
import { ConnectorButton, ConnectorIcon, ConnectorLabel, ConnectorsContainer, RecentlyUsedTag } from './styles'

const ConnectorList = () => {
  const context = useOpenfort()
  const isMobile = useIsMobile()

  const wallets = useWagmiWallets()
  const { lastConnectorId } = useLastConnector()
  const familyConnector = useFamilyConnector()
  const familyAccountsConnector = useFamilyAccountsConnector()

  let filteredWallets = wallets.filter(
    (wallet) => wallet.id !== familyAccountsConnector?.id && wallet.id !== embeddedWalletId
  )
  if (familyConnector && isFamily()) {
    filteredWallets = filteredWallets.filter((wallet) => wallet.id !== familyConnector?.id)
  }

  const walletsToDisplay =
    context.uiConfig.hideRecentBadge || lastConnectorId === 'walletConnect' // do not hoist walletconnect to top of list
      ? wallets
      : [
          // move last used wallet to top of list
          // using .filter and spread to avoid mutating original array order with .sort
          ...wallets.filter((wallet) => lastConnectorId === wallet.connector.id && wallet.id !== embeddedWalletId),
          ...wallets.filter((wallet) => lastConnectorId !== wallet.connector.id && wallet.id !== embeddedWalletId),
        ]

  return (
    <ScrollArea mobileDirection={'horizontal'}>
      {filteredWallets.length === 0 && <Alert error>No connectors found in Openfort config.</Alert>}
      {filteredWallets.length > 0 && (
        <ConnectorsContainer $mobile={isMobile} $totalResults={walletsToDisplay.length}>
          {filteredWallets.map((wallet) => (
            <ConnectorItem key={wallet.id} wallet={wallet} isRecent={wallet.id === lastConnectorId} />
          ))}
        </ConnectorsContainer>
      )}
    </ScrollArea>
  )
}

export default ConnectorList

const ConnectorItem = ({ wallet, isRecent }: { wallet: WalletProps; isRecent?: boolean }) => {
  const {
    connect: { getUri },
  } = useWeb3()
  const wcUri = getUri()
  const isMobile = useIsMobile()
  const context = useOpenfort()

  const { connect } = useConnect()

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
    (!wallet.isInstalled && isMobile) || (wallet.shouldDeeplinkDesktop && !isMobile)
      ? wallet.getWalletConnectDeeplink?.(wcUri ?? '')
      : undefined

  const redirectToMoreWallets = isMobile && isWalletConnectConnector(wallet.id)
  // Safari requires opening popup on user gesture, so we connect immediately here
  const shouldConnectImmediately =
    (detectBrowser() === 'safari' || detectBrowser() === 'ios') &&
    (isCoinbaseWalletConnector(wallet.connector.id) || isPortoConnector(wallet.connector.id))

  if (redirectToMoreWallets || shouldConnectImmediately) deeplink = undefined // mobile redirects to more wallets page

  const content = () => (
    <>
      <ConnectorIcon
        data-small={wallet.iconShouldShrink}
        data-shape={wallet.iconShape}
        data-background={redirectToMoreWallets}
      >
        {wallet.iconConnector ?? wallet.icon}
      </ConnectorIcon>
      <ConnectorLabel>
        {isMobile ? (wallet.shortName ?? wallet.name) : wallet.name}
        {!context.uiConfig.hideRecentBadge && isRecent && (
          <RecentlyUsedTag>
            <span>Recent</span>
          </RecentlyUsedTag>
        )}
      </ConnectorLabel>
    </>
  )

  return (
    <ConnectorButton
      type="button"
      onClick={() => {
        if (isMobile && deeplink) {
          context.setRoute(routes.CONNECT_WITH_MOBILE)
          context.setConnector({ id: wallet.id })
          return
        }

        if (redirectToMoreWallets) {
          context.setRoute(routes.MOBILECONNECTORS)
        } else {
          if (shouldConnectImmediately) {
            connect({ connector: wallet?.connector })
          }
          context.setRoute({ route: routes.CONNECT, connectType: 'linkIfUserConnectIfNoUser' })
          context.setConnector({ id: wallet.id })
        }
      }}
    >
      {content()}
    </ConnectorButton>
  )
}
