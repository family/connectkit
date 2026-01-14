import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { DisconnectIcon, GuestIcon, KeyIcon } from '../../../assets/icons'
import useLocales from '../../../hooks/useLocales'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { isSafeConnector } from '../../../utils'
import { LargeButton } from '../../Common/LargeButton'
import { ModalContent, ModalHeading } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { DisconnectButton } from '../Connected/styles'

const Profile: React.FC = () => {
  const { setOpen, setRoute } = useOpenfort()
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
        {/* <ModalBody>Manage your profile.</ModalBody> */}
        <div>
          <LargeButton
            onClick={() => {
              setRoute(routes.LINKED_PROVIDERS)
            }}
            icon={<GuestIcon />}
          >
            Authentication methods
          </LargeButton>
          <LargeButton
            onClick={() => {
              setRoute(routes.EXPORT_KEY)
            }}
            icon={<KeyIcon />}
          >
            Export key
          </LargeButton>
        </div>
      </ModalContent>
      {!isSafeConnector(connector?.id) && (
        <DisconnectButton onClick={() => setShouldDisconnect(true)} icon={<DisconnectIcon />}>
          {locales.disconnect}
        </DisconnectButton>
      )}
    </PageContent>
  )
}

export default Profile
