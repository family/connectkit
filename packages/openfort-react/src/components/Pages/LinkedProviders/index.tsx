import { ModalBody, ModalContent, ModalHeading } from '../../Common/Modal/styles'
import { PageContent } from '../../PageContent'
import { LinkedProviders } from './LinkedProviders'

const LinkedProvidersPage: React.FC = () => {
  return (
    <PageContent>
      <ModalContent>
        <ModalHeading>Authentication methods</ModalHeading>
        <ModalBody>Set up the authentication methods of your account.</ModalBody>
        <LinkedProviders showHeader={false} />
      </ModalContent>
    </PageContent>
  )
}

export default LinkedProvidersPage
