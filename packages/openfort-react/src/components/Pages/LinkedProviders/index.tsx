import type { AuthPlayerResponse } from '@openfort/openfort-js'
import { useMemo } from 'react'
import { EmailIcon, WalletIcon as Wallet } from '../../../assets/icons'
import Logos, { providersLogos } from '../../../assets/logos'
import { useProviders } from '../../../hooks/openfort/useProviders'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { useWagmiWallets } from '../../../wallets/useWagmiWallets'
import Button from '../../Common/Button'
import FitText from '../../Common/FitText'
import { ModalBody, ModalContent, ModalHeading } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { LinkedProviderContainer, LinkedProvidersGroupWrapper, LinkedProviderText, ProviderIconWrapper } from './styles'

type LinkedProvidersProps = {
  showHeader?: boolean
}

const WalletIcon: React.FC<{ provider: AuthPlayerResponse['linkedAccounts'][0] }> = ({ provider }) => {
  const wallets = useWagmiWallets()
  const wallet = useMemo(() => {
    return wallets.find((w) => w.id?.toLowerCase() === provider.walletClientType)
  }, [provider])

  if (provider.walletClientType === 'walletconnect') return <Logos.WalletConnect />

  if (wallet) return <>{wallet.iconConnector ?? wallet.icon}</>

  return <Wallet />
}

const ProviderIcon: React.FC<{ provider: AuthPlayerResponse['linkedAccounts'][0] }> = ({ provider }) => {
  switch (provider.provider) {
    case 'email':
      return <EmailIcon />
    case 'wallet':
      return <WalletIcon provider={provider} />
    case 'google':
    case 'twitter':
    case 'facebook':
      return providersLogos[provider.provider]
    default:
      return <FitText>{provider.provider.substring(0, 4).toUpperCase()}</FitText>
  }
}

const LinkedProvider: React.FC<{ provider: AuthPlayerResponse['linkedAccounts'][0] }> = ({ provider }) => {
  return (
    <LinkedProviderContainer>
      <ProviderIconWrapper>
        <ProviderIcon provider={provider} />
      </ProviderIconWrapper>
      <LinkedProviderText>{provider.address || provider.email || 'unknown'}</LinkedProviderText>
    </LinkedProviderContainer>
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
  const { user, isLoading } = useOpenfortCore()

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

  if (user.linkedAccounts.length === 0) {
    return (
      <div>
        <AddLinkedProviderButton />
      </div>
    )
  }

  return (
    <>
      <LinkedProvidersGroupWrapper>
        {user.linkedAccounts.map((provider) => (
          <LinkedProvider
            key={`${provider.provider}-${provider.address || provider.email || 'unknown'}`}
            provider={provider}
          />
        ))}
      </LinkedProvidersGroupWrapper>
      <AddLinkedProviderButton />
    </>
  )
}

const LinkedProviders: React.FC = () => {
  return (
    <PageContent>
      <ModalHeading>Linked accounts</ModalHeading>
      <ModalContent>
        <ModalBody>Configure the linked accounts of your profile.</ModalBody>
      </ModalContent>
      <LinkedProvidersGroup />
    </PageContent>
  )
}

export default LinkedProviders
