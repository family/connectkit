import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import Loader from '../../Common/Loading'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'

const Loading: React.FC = () => {
  const { setRoute, walletConfig } = useOpenfort()
  const { isLoading, user, needsRecovery } = useOpenfortCore()
  const { address } = useAccount()
  const [isFirstFrame, setIsFirstFrame] = React.useState(true)
  const [retryCount, setRetryCount] = React.useState(0)

  useEffect(() => {
    if (isFirstFrame) return

    if (isLoading) return
    else if (!user) setRoute(routes.PROVIDERS)
    else if (!address) {
      if (!walletConfig) setRoute({ route: routes.CONNECTORS, connectType: 'connect' })
      else setRoute(routes.LOAD_WALLETS)
    } else if (needsRecovery) {
      if (!walletConfig) setRoute({ route: routes.CONNECTORS, connectType: 'connect' })
      else setRoute(routes.LOAD_WALLETS)
    } else setRoute(routes.CONNECTED)
  }, [isLoading, user, address, needsRecovery, isFirstFrame, retryCount])

  // Retry every 250ms
  useEffect(() => {
    const interval = setInterval(() => {
      setRetryCount((r) => r + 1)
    }, 250)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // UX: Wait a bit before showing the next page
    setTimeout(() => setIsFirstFrame(false), 400)
  }, [])

  return (
    <PageContent>
      <Loader header="Redirecting" />
    </PageContent>
  )
}

export default Loading
