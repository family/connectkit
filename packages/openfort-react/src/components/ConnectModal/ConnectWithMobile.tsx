import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useConnectWithSiwe } from '../../hooks/openfort/useConnectWithSiwe'
import styled from '../../styles/styled'
import { isAndroid } from '../../utils'
import { logger } from '../../utils/logger'
import { useOnUserReturn } from '../../utils/useOnUserReturn'
import { useWallet } from '../../wallets/useWallets'
import { walletConfigs } from '../../wallets/walletConfigs'
import Button from '../Common/Button'
import FitText from '../Common/FitText'
import Loader from '../Common/Loading'
import { useWeb3 } from '../contexts/web3'
import { routes } from '../Openfort/types'
import { useOpenfort } from '../Openfort/useOpenfort'
import { PageContent } from '../PageContent'

const states = {
  INIT: 'init',
  REDIRECT: 'redirect',
  CONNECTING: 'connecting',
  ERROR: 'error',
}

const DownloadFooter = styled.div`
  margin-top: 30px;
  color: var(--ck-body-color-muted);
`

const ConnectWithMobile: React.FC = () => {
  const { connector, setRoute } = useOpenfort()

  const walletId = Object.keys(walletConfigs).find(
    // where id is comma separated list
    (id) =>
      id
        .split(',')
        .map((i) => i.trim())
        .indexOf(connector.id) !== -1
  )

  const wallet = useWallet(connector.id) || (walletId && walletConfigs[walletId]) || {}
  const { isConnected } = useAccount()

  const [status, setStatus] = useState(isConnected ? states.INIT : states.CONNECTING)
  const [description, setDescription] = useState<string | undefined>(undefined)

  const {
    connect: { getUri },
  } = useWeb3()
  const wcUri = getUri()

  const [hasReturned, setHasReturned] = useState(false)

  const siwe = useConnectWithSiwe()

  const openApp = (url?: string) => {
    const uri = wallet?.getWalletConnectDeeplink?.(url ?? '')
    logger.log('Opening wallet app with uri', { uri, url, wallet, walletId, walletConfigs, connectorId: connector.id })
    if (uri) {
      if (url) {
        window.location.href = uri
      } else {
        window.location.href = uri.replace('?uri=', '')
      }
    } else {
      setStatus(states.ERROR)
      setDescription('Wallet does not support deeplink')
    }
  }

  useOnUserReturn(() => {
    setTimeout(() => {
      setHasReturned(true)
    }, 250)
  })

  useEffect(() => {
    if (hasReturned) {
      setHasReturned(false)
      if (isConnected) {
        setStatus(states.CONNECTING)
      } else {
        setStatus(states.ERROR)
        setDescription('Connection failed or cancelled')
      }
    }
  }, [hasReturned, isConnected])

  useEffect(() => {
    switch (status) {
      case states.INIT:
        openApp(wcUri!)
        break
      case states.CONNECTING:
        setDescription('Requesting signature to verify wallet...')
        siwe({
          walletClientType: walletId,
          onConnect: () => {
            setRoute(routes.PROFILE)
          },
          onError: (error) => {
            setStatus(states.ERROR)
            setDescription(error || 'Connection failed')
          },
        })
        break
    }
  }, [status])

  return (
    <PageContent>
      <Loader
        header={`Connecting with ${connector.id.split(',')[0]}`}
        icon={wallet?.icon}
        isError={status === states.ERROR}
        description={description}
        onRetry={() => {
          setStatus(isConnected ? states.CONNECTING : states.INIT)
          setDescription('')
        }}
      />
      {isConnected ? (
        <Button
          onClick={() => {
            openApp()
          }}
        >
          Sign in App
        </Button>
      ) : (
        <Button
          onClick={() => {
            openApp(wcUri!)
          }}
        >
          Sign in App
        </Button>
      )}
      <DownloadFooter>
        <FitText>
          Don't have {wallet.name ?? connector.id.split(',')[0]} installed?{' '}
          <a
            style={{ marginLeft: 5 }}
            href={isAndroid() ? wallet?.downloadUrls?.android : wallet?.downloadUrls?.ios}
            target="_blank"
            rel="noreferrer"
          >
            GET
          </a>
        </FitText>
      </DownloadFooter>
    </PageContent>
  )
}

export default ConnectWithMobile
