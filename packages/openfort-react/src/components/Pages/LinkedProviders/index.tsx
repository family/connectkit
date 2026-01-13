import { useEffect } from 'react'
import { useProviders } from '../../../hooks/openfort/useProviders'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import type { UserAccount } from '../../../openfortCustomTypes'
import Button from '../../Common/Button'
import { ModalBody, ModalContent, ModalHeading } from '../../Common/Modal/styles'
import { ProviderHeader } from '../../Common/Providers/ProviderHeader'
import { ProviderIcon } from '../../Common/Providers/ProviderIcon'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import {
  LinkedProviderButtonContainer,
  LinkedProviderButtonWrapper,
  LinkedProvidersGroupWrapper,
  ProviderIconWrapper,
} from './styles'

type LinkedProvidersProps = {
  showHeader?: boolean
}

const LinkedProvider: React.FC<{ provider: UserAccount }> = ({ provider }) => {
  const { setRoute } = useOpenfort()
  return (
    <LinkedProviderButtonContainer>
      <Button onClick={() => setRoute({ route: routes.LINKED_PROVIDER, provider })} fitText={false}>
        <LinkedProviderButtonWrapper>
          <ProviderIconWrapper>
            <ProviderIcon provider={provider} />
          </ProviderIconWrapper>
          <ProviderHeader provider={provider} />
        </LinkedProviderButtonWrapper>
      </Button>
    </LinkedProviderButtonContainer>
  )
}

const AddLinkedProviderButton: React.FC = () => {
  const { setRoute } = useOpenfort()
  const { availableProviders: unlinkedProviders } = useProviders()

  return (
    <Button disabled={unlinkedProviders.length === 0} onClick={() => setRoute(routes.PROVIDERS)}>
      +
    </Button>
  )
}

const LinkedProvidersGroup: React.FC<LinkedProvidersProps> = () => {
  const { linkedAccounts, user, isLoading } = useOpenfortCore()
  const { triggerResize } = useOpenfort()

  useEffect(() => {
    if (!isLoading) triggerResize()
  }, [isLoading])

  // TODO: Show loading
  if (isLoading) {
    return (
      <div>
        <AddLinkedProviderButton />
      </div>
    )
  }

  // TODO: show error
  if (!user) {
    return (
      <div>
        <AddLinkedProviderButton />
      </div>
    )
  }

  return (
    <>
      <LinkedProvidersGroupWrapper>
        {linkedAccounts.length === 0 && !user.email && !user.phoneNumber && (
          <ModalContent>
            You are logged in as a guest.
            <ModalBody>Add authentication methods to avoid losing access to your account.</ModalBody>
          </ModalContent>
        )}
        {!linkedAccounts.find((a) => a.provider === 'credential') && user.email && (
          <LinkedProvider
            key={`credential-${user.email}`}
            provider={{ provider: 'credential', accountId: user.email }}
          />
        )}
        {linkedAccounts.map((provider) => (
          <LinkedProvider key={`${provider.provider}-${provider.accountId}`} provider={provider} />
        ))}
        {user.phoneNumber && (
          <LinkedProvider
            key={`phone-${user.phoneNumber}`}
            provider={{
              provider: 'phone',
              accountId: user.phoneNumber,
            }}
          />
        )}
      </LinkedProvidersGroupWrapper>
      <AddLinkedProviderButton />
    </>
  )
}

const LinkedProviders: React.FC = () => {
  return (
    <PageContent>
      <ModalHeading>Authentication methods</ModalHeading>
      <LinkedProvidersGroup />
    </PageContent>
  )
}

export default LinkedProviders
