import { useEffect } from 'react'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { ModalBody, ModalContent, ModalH1 } from '../../Common/Modal/styles'
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
        <ModalH1>Linked providers</ModalH1>
        <ModalBody style={{ marginTop: 8 }}>View and manage the providers linked to your account.</ModalBody>
        <LinkedProvidersCard>
          <LinkedProviders showHeader={false} />
        </LinkedProvidersCard>
      </ModalContent>
    </PageContent>
  )
}

export default LinkedProvidersPage
