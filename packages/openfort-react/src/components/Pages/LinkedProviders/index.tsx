import { EmailIcon } from '../../../assets/icons'
import { providersLogos } from '../../../assets/logos'
import { useProviders } from '../../../hooks/openfort/useProviders'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import type { UserAccountResponse } from '../../../openfortCustomTypes'
import Button from '../../Common/Button'
import FitText from '../../Common/FitText'
import { ModalBody, ModalContent, ModalHeading } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { LinkedProviderContainer, LinkedProvidersGroupWrapper, ProviderIconWrapper } from './styles'

type LinkedProvidersProps = {
  showHeader?: boolean
}

// const WalletIcon: React.FC<{ provider: UserAccountResponse }> = ({ provider }) => {
//   const wallets = useWagmiWallets()
//   const wallet = useMemo(() => {
//     return wallets.find((w) => w.id?.toLowerCase() === provider.walletClientType)
//   }, [provider])

//   if (provider.walletClientType === 'walletconnect') return <Logos.WalletConnect />

//   if (wallet) return <>{wallet.iconConnector ?? wallet.icon}</>

//   return <Wallet />
// }

const ProviderIcon: React.FC<{ provider: UserAccountResponse }> = ({ provider }) => {
  switch (provider.providerId) {
    case 'email':
      return <EmailIcon />
    // OTP_TODO: Wallet icon
    // case 'wallet':
    //   return <WalletIcon provider={provider} />
    case 'google':
    case 'twitter':
    case 'facebook':
      return providersLogos[provider.providerId]
    default:
      return <FitText>{provider.providerId.substring(0, 4).toUpperCase()}</FitText>
  }
}

const LinkedProvider: React.FC<{ provider: UserAccountResponse }> = ({ provider }) => {
  // OTP_TODO: linked provider details
  return (
    <LinkedProviderContainer>
      <ProviderIconWrapper>
        <ProviderIcon provider={provider} />
      </ProviderIconWrapper>
      {/* <LinkedProviderText>{provider.address || provider.email || 'unknown'}</LinkedProviderText> */}
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
          <LinkedProvider key={`${provider.providerId}-${provider.id}`} provider={provider} />
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
