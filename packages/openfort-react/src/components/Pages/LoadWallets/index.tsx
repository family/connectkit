import { useEffect, useState } from 'react'
import { embeddedWalletId } from '../../../constants/openfort'
import { useWallets } from '../../../hooks/openfort/useWallets'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { logger } from '../../../utils/logger'
import Loader from '../../Common/Loading'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'

const LoadWallets: React.FC = () => {
  const { user } = useOpenfortCore()
  const { triggerResize, setRoute, setConnector } = useOpenfort()
  const { wallets, isLoadingWallets, error: errorWallets } = useWallets()
  const [loadingUX, setLoadingUX] = useState(true)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (!isLoadingWallets) {
      timeout = setTimeout(() => {
        setLoadingUX(false)
        triggerResize()
      }, 500)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [isLoadingWallets])

  useEffect(() => {
    if (loadingUX || isLoadingWallets) return
    if (!wallets) {
      logger.error('Could not load wallets for user:', user)
      return
    }
    logger.log('User wallets loaded:', wallets)

    if (wallets.length === 0) {
      setRoute(routes.CREATE_WALLET)
      return
    }

    if (wallets.length === 1) {
      if (wallets[0].id === embeddedWalletId) {
        setRoute({ route: routes.RECOVER_WALLET, wallet: wallets[0] })
      } else {
        setRoute({ route: routes.CONNECT, connectType: 'recover', wallet: wallets[0] })
        setConnector({ id: wallets[0].id })
      }
      return
    }

    setRoute(routes.SELECT_WALLET_TO_RECOVER)
  }, [loadingUX])

  const isError = !!errorWallets || !user
  const errorMessage = errorWallets ? errorWallets.message || 'There was an error loading wallets' : undefined

  return (
    <PageContent onBack={!user ? 'back' : null}>
      <Loader
        header="Setting up wallet"
        isError={isError}
        description={isError ? errorMessage : 'Setting up wallets'}
      />
    </PageContent>
  )
}

export default LoadWallets
