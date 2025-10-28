import { useEffect } from 'react'
import { useGuestAuth } from '../../../hooks/openfort/auth/useGuestAuth'
import Loader from '../../Common/Loading'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'

const CreateGuestUserPage = () => {
  const { setRoute } = useOpenfort()
  const { signUpGuest, error } = useGuestAuth({
    recoverWalletAutomatically: false,
    onSuccess: () => {
      setRoute(routes.LOAD_WALLETS)
    },
  })

  useEffect(() => {
    signUpGuest()
  }, [])

  return (
    <PageContent onBack={null}>
      <Loader
        header={error ? 'Error creating guest user.' : 'Creating guest user...'}
        isError={!!error}
        onRetry={() => signUpGuest()}
      />
    </PageContent>
  )
}

export default CreateGuestUserPage
