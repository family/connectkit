import { useAccount, useDisconnect } from 'wagmi'
import { embeddedWalletId } from '../../../constants/openfort'
import { useFamilyAccountsConnector, useFamilyConnector } from '../../../hooks/useConnectors'

import useIsMobile from '../../../hooks/useIsMobile'
import { useLastConnector } from '../../../hooks/useLastConnector'
import { isFamily } from '../../../utils/wallets'
import { useWagmiWallets, type WalletProps } from '../../../wallets/useWagmiWallets'
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
  const isMobile = useIsMobile()
  const context = useOpenfort()
  const { disconnectAsync } = useDisconnect()
  const { connector } = useAccount()

  const content = () => (
    <>
      <ConnectorIcon data-small={wallet.iconShouldShrink} data-shape={wallet.iconShape}>
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
      onClick={async () => {
        // Disconnect if the same connector is selected, otherwise wagmi won't trigger the connection flow
        // Disconnect for wallet connect to work
        if (wallet.id === 'walletConnect' || wallet.id === connector?.id) {
          await disconnectAsync()
        }

        context.setRoute({ route: routes.CONNECT, connectType: 'linkIfUserConnectIfNoUser' })
        context.setConnector({ id: wallet.id })
      }}
    >
      {content()}
    </ConnectorButton>
  )
}
