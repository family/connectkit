import type React from 'react'
import { useEffect, useState } from 'react'
import { useAccount, useConnect } from 'wagmi'
import useIsMobile from '../../../hooks/useIsMobile'
import { useWalletConnectModal } from '../../../hooks/useWalletConnectModal'
import ConnectorList from '../../Common/ConnectorList'
import Loader from '../../Common/Loading'
import { PageContent } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'

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

const Wallets: React.FC = () => {
  const isMobile = useIsMobile()

  return <PageContent style={{ width: 312 }}>{isMobile ? <ConnectWithMobile /> : <ConnectorList />}</PageContent>
}

export default Wallets
