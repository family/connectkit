import { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useConnectWithSiwe } from '../../hooks/openfort/useConnectWithSiwe'
import styled from '../../styles/styled'
import { isAndroid } from '../../utils'
import { useOnUserReturn } from '../../utils/useOnUserReturn'
import { useWallet } from '../../wallets/useWallets'
import { walletConfigs } from '../../wallets/walletConfigs'
import Button from '../Common/Button'
import FitText from '../Common/FitText'
import Loader from '../Common/Loading'
import { PageContent } from '../Common/Modal/styles'
import { useWeb3 } from '../contexts/web3'
import { routes } from '../Openfort/types'
import { useOpenfort } from '../Openfort/useOpenfort'

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

  const wallet = useWallet(connector.id) || walletConfigs[connector.id]

  const [status, setStatus] = useState(states.INIT)
  const [description, setDescription] = useState<string | undefined>(undefined)

  const {
    connect: { getUri },
  } = useWeb3()
  const wcUri = getUri()

  const [hasReturned, setHasReturned] = useState(false)
  const { isConnected } = useAccount()
  const [shouldRedirectToWalletApp, setShouldRedirectToWalletApp] = useState(false)

  const siwe = useConnectWithSiwe()

  const openApp = useCallback(
    (url?: string) => {
      const uri = wallet?.getWalletConnectDeeplink?.(url ?? '')
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
    },
    [wallet]
  )

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
        setDescription('Requesting signature...')
        siwe({
          onConnect: () => {
            setRoute(routes.PROFILE)
          },
          onError: (error) => {
            setStatus(states.ERROR)
            setDescription(error || 'Connection failed')
          },
        })
        setTimeout(() => {
          setShouldRedirectToWalletApp(true)
        }, 1500)
        break
    }
  }, [status, openApp, setRoute, siwe, wcUri])

  useEffect(() => {
    if (shouldRedirectToWalletApp && status === states.CONNECTING) {
      openApp()
    }
  }, [shouldRedirectToWalletApp, status, openApp])

  return (
    <PageContent>
      <Loader
        header={`Connecting with ${connector.id.split(',')[0]}`}
        icon={wallet?.icon}
        isError={status === states.ERROR}
        description={description}
        onRetry={() => {
          if (isConnected) {
            setStatus(states.CONNECTING)
            return
          }
          setStatus(states.INIT)
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
