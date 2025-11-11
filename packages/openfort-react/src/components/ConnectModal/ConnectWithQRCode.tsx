import { useEffect, useState } from 'react'
import { useAccount, useEnsName } from 'wagmi'
import { useConnectWithSiwe } from '../../hooks/openfort/useConnectWithSiwe'
import { useWalletConnectModal } from '../../hooks/useWalletConnectModal'
import { truncateEthAddress } from '../../utils'
import { useWallet } from '../../wallets/useWagmiWallets'
import { CopyText } from '../Common/CopyToClipboard/CopyText'
import Loader from '../Common/Loading'
import { ModalBody } from '../Common/Modal/styles'
import { routes } from '../Openfort/types'
import { useOpenfort } from '../Openfort/useOpenfort'
import { PageContent } from '../PageContent'

const ConnectWithSiwe = () => {
  const { isConnected, address } = useAccount()
  const { connector, setRoute } = useOpenfort()
  const wallet = useWallet(connector.id)

  const [error, setError] = useState<string | undefined>(undefined)
  const siwe = useConnectWithSiwe()
  const [description, setDescription] = useState<string | undefined>(undefined)

  const connectWithSiwe = () => {
    setDescription('Requesting signature to verify wallet...')
    siwe({
      walletClientType: connector.id,
      onConnect: () => {
        setRoute(routes.PROFILE)
      },
      onError: (error) => {
        setError(error || 'Connection failed')
        setDescription(undefined)
      },
    })
  }

  useEffect(() => {
    if (isConnected) {
      connectWithSiwe()
    }
  }, [isConnected])

  const { data: ensName } = useEnsName({
    chainId: 1,
    address: address,
  })

  return (
    <PageContent>
      <ModalBody style={{ textAlign: 'center' }}>
        Connected with
        <CopyText value={address || ''}>{ensName ?? truncateEthAddress(address)}</CopyText>
      </ModalBody>
      <Loader
        header={'Sign in to your wallet'}
        icon={wallet?.icon}
        isError={!!error}
        description={error ?? description}
        onRetry={() => connectWithSiwe()}
      />
    </PageContent>
  )
}

const ConnectWithWalletConnect = () => {
  const { connector } = useOpenfort()
  const wallet = useWallet(connector.id)

  const [error, setError] = useState<string | undefined>(undefined)
  const { open: openWalletConnectModal } = useWalletConnectModal()

  useEffect(() => {
    openWCModal()
  }, [])

  const openWCModal = async () => {
    setError(undefined)

    const { error } = await openWalletConnectModal()
    if (error) {
      setError(error)
    }
  }

  return (
    <PageContent>
      <Loader
        header={error ? 'Error connecting wallet.' : `Connecting...`}
        icon={wallet?.icon}
        isError={!!error}
        description={error}
        onRetry={() => openWCModal()}
      />
    </PageContent>
  )
}

const ConnectWithQRCode = () => {
  const { connector, triggerResize } = useOpenfort()
  const { isConnected } = useAccount()

  useEffect(() => {
    triggerResize()
  }, [isConnected])

  const wallet = useWallet(connector.id)

  if (!wallet) return <Loader header={`Connector not found: ${connector.id}`} isError />

  if (isConnected) {
    return <ConnectWithSiwe />
  }

  return <ConnectWithWalletConnect />
}

export default ConnectWithQRCode
