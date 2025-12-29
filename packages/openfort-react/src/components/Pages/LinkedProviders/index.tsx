import { useMemo } from 'react'
import { EmailIcon, WalletIcon } from '../../../assets/icons'
import Logos, { providersLogos } from '../../../assets/logos'
import { useProviders } from '../../../hooks/openfort/useProviders'
import { useUser } from '../../../hooks/openfort/useUser'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import type { UserAccount } from '../../../openfortCustomTypes'
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

const WalletIconWrapper: React.FC<{ provider: UserAccount }> = ({ provider }) => {
  const wallets = useWagmiWallets()
  const wallet = useMemo(() => {
    return wallets.find((w) => w.id?.toLowerCase() === provider.walletClientType)
  }, [provider])

  if (provider.walletClientType === 'walletconnect') return <Logos.WalletConnect />

  if (wallet) return <>{wallet.iconConnector ?? wallet.icon}</>

  return <WalletIcon />
}

const ProviderIcon: React.FC<{ provider: UserAccount }> = ({ provider }) => {
  switch (provider.provider) {
    case 'email':
    case 'credential':
      return <EmailIcon />
    // OTP_TODO: Wallet icon
    case 'wallet':
    case 'siwe':
      return <WalletIconWrapper provider={provider} />
    case 'google':
    case 'twitter':
    case 'facebook':
      return providersLogos[provider.provider]
    default:
      return <FitText>{provider.provider.substring(0, 4).toUpperCase()}</FitText>
  }
}

const ProviderText: React.FC<{ provider: UserAccount }> = ({ provider }) => {
  const { user } = useUser()
  switch (provider.provider) {
    case 'wallet':
    case 'siwe':
      return <LinkedProviderText>{provider.accountId}</LinkedProviderText>
    default:
      return (
        <LinkedProviderText style={{ textTransform: user?.email ? 'none' : 'capitalize' }}>
          {user?.email ?? provider.provider}
        </LinkedProviderText>
      )
  }
}

const LinkedProvider: React.FC<{ provider: UserAccount }> = ({ provider }) => {
  // OTP_TODO: linked provider details
  return (
    <LinkedProviderContainer>
      <ProviderIconWrapper>
        <ProviderIcon provider={provider} />
      </ProviderIconWrapper>
      <ProviderText provider={provider} />
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
  const { linkedAccounts, user, isLoading } = useOpenfortCore()

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

  if (linkedAccounts.length === 0) {
    return (
      <div>
        <AddLinkedProviderButton />
      </div>
    )
  }

  return (
    <>
      <LinkedProvidersGroupWrapper>
        {linkedAccounts.map((provider) => (
          <LinkedProvider key={`${provider.provider}-${provider.accountId}`} provider={provider} />
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
        <ModalBody>Linked accounts settings.</ModalBody>
      </ModalContent>
      <LinkedProvidersGroup />
    </PageContent>
  )
}

export default LinkedProviders
