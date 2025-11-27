import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { DisconnectIcon } from '../../../assets/icons'
import useLocales from '../../../hooks/useLocales'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { isSafeConnector } from '../../../utils'
import { ModalBody, ModalContent, ModalHeading } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { LinkedProviders } from '../Connected/LinkedProviders'
import { DisconnectButton } from '../Connected/styles'
import { LinkedProvidersCard } from './styles'

const LinkedProvidersPage: React.FC = () => {
  const { setOpen } = useOpenfort()
  const { logout } = useOpenfortCore()

  const locales = useLocales()

  const { connector } = useAccount()
  const [shouldDisconnect, setShouldDisconnect] = useState(false)

  useEffect(() => {
    if (!shouldDisconnect) return

    // Close before disconnecting to avoid layout shifting while modal is still open
    setOpen(false)
    return () => {
      logout()
    }
  }, [shouldDisconnect])

  return (
    <PageContent onBack={routes.CONNECTED}>
      <ModalContent>
        <ModalHeading>Profile</ModalHeading>
        <ModalBody>View and manage the authentication methods of your account.</ModalBody>
        <LinkedProvidersCard>
          <LinkedProviders showHeader={false} />
        </LinkedProvidersCard>
      </ModalContent>
      {!isSafeConnector(connector?.id) && (
        <DisconnectButton onClick={() => setShouldDisconnect(true)} icon={<DisconnectIcon />}>
          {locales.disconnect}
        </DisconnectButton>
      )}
    </PageContent>
  )
}

export default LinkedProvidersPage
