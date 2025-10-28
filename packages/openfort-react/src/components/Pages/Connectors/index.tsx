import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useConnect } from '../../../hooks/useConnect'
import useIsMobile from '../../../hooks/useIsMobile'
import { useWalletConnectModal } from '../../../hooks/useWalletConnectModal'
import ConnectorList from '../../Common/ConnectorList'
import Loader from '../../Common/Loading'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'

const ConnectWithMobile = () => {
  const { open: openWalletConnectModal } = useWalletConnectModal()
  const [error, setError] = useState<string | undefined>(undefined)
  const { connect, connectors } = useConnect()
  const { connector, address } = useAccount()
  const { setRoute, setConnector } = useOpenfort()

  const openWCModal = async () => {
    setError(undefined)
    const { error } = await openWalletConnectModal()
    if (error) {
      setError(error)
    }
  }

  useEffect(() => {
    openWCModal()
  }, [connect, connectors])

  useEffect(() => {
    if (connector && address) {
      const walletConnectDeeplinkChoice = localStorage.getItem('WALLETCONNECT_DEEPLINK_CHOICE')

      if (walletConnectDeeplinkChoice) {
        const parsedChoice: { href: string; name: string } = JSON.parse(walletConnectDeeplinkChoice)
        setConnector({ id: parsedChoice.name })
      } else {
        setConnector({ id: connector.id })
      }

      setRoute(routes.CONNECT_WITH_MOBILE)
    }
  }, [address, connector])

  return (
    <Loader
      header={error ? 'Error connecting wallet.' : `Connecting...`}
      isError={!!error}
      description={error}
      onRetry={() => openWCModal()}
    />
  )
}

const Connectors = ({ logoutOnBack }: { logoutOnBack?: boolean }) => {
  const isMobile = useIsMobile()

  return (
    // TODO: logout on back
    <PageContent logoutOnBack={logoutOnBack} width={312}>
      {isMobile ? <ConnectWithMobile /> : <ConnectorList />}
    </PageContent>
  )
}

export default Connectors
