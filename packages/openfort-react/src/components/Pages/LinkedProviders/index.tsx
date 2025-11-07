import { useEffect } from 'react'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { ModalBody, ModalContent, ModalHeading } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { LinkedProviders } from '../Profile/LinkedProviders'
import { LinkedProvidersCard } from './styles'

const LinkedProvidersPage: React.FC = () => {
  const { triggerResize } = useOpenfort()
  const { updateUser } = useOpenfortCore()

  useEffect(() => {
    triggerResize()
  }, [triggerResize])

  useEffect(() => {
    updateUser().catch(() => {
      /* silently ignore refresh errors */
    })
  }, [updateUser])

  return (
    <PageContent onBack={routes.PROFILE}>
      <ModalContent style={{ paddingBottom: 18, textAlign: 'left' }}>
        <ModalHeading>Profile</ModalHeading>
        <ModalBody>View and manage the authentication methods of your account.</ModalBody>
        <LinkedProvidersCard>
          <LinkedProviders showHeader={false} />
        </LinkedProvidersCard>
      </ModalContent>
    </PageContent>
  )
}

export default LinkedProvidersPage
