import { useMemo } from 'react'
import type { Hex } from 'viem'
import { useEnsName } from 'wagmi'
import { useUser } from '../../../hooks/openfort/useUser'
import { useEnsFallbackConfig } from '../../../hooks/useEnsFallbackConfig'
import type { UserAccount } from '../../../openfortCustomTypes'
import styled from '../../../styles/styled'
import { truncateEthAddress } from '../../../utils'
import Button from '../../Common/Button'
import { CopyText } from '../../Common/CopyToClipboard/CopyText'
import FitText from '../../Common/FitText'
import { ModalBody, ModalContent, ModalH1, ModalHeading } from '../../Common/Modal/styles'
import { getProviderName } from '../../Common/Providers/getProviderName'
import { ProviderHeader } from '../../Common/Providers/ProviderHeader'
import { ProviderIcon } from '../../Common/Providers/ProviderIcon'
import { useThemeContext } from '../../ConnectKitThemeProvider/ConnectKitThemeProvider'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'

const ProviderIconContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ProviderIconWrapper = styled.div`
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ck-body-background-secondary);
  border-radius: 28px;
`
const ProviderIconInner = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SiweContent = ({ provider }: { provider: UserAccount }) => {
  const address = provider.accountId as Hex
  const ensFallbackConfig = useEnsFallbackConfig()
  const { data: ensName } = useEnsName({
    chainId: 1,
    address,
    config: ensFallbackConfig,
  })
  const context = useOpenfort()
  const themeContext = useThemeContext()

  const separator = ['web95', 'rounded', 'minimal'].includes(themeContext.theme ?? context.uiConfig.theme ?? '')
    ? '....'
    : undefined

  return (
    <>
      <ModalH1>
        <CopyText value={address}>{ensName ?? truncateEthAddress(address, separator)}</CopyText>
      </ModalH1>
      <div style={{ marginTop: '16px' }}>
        Linked via Sign-In with Ethereum (SIWE)
        <Button onClick={() => context.setRoute({ route: 'removeLinkedProvider', provider })}>
          Remove this wallet
        </Button>
      </div>
    </>
  )
}

const OAuthContent = ({ provider }: { provider: UserAccount }) => {
  const { user } = useUser()
  const { setRoute } = useOpenfort()

  return (
    <>
      <ModalH1>{provider.provider.charAt(0).toUpperCase() + provider.provider.slice(1)}</ModalH1>
      <div style={{ marginTop: '16px' }}>
        {user?.email}
        <Button onClick={() => setRoute({ route: 'removeLinkedProvider', provider })}>
          Remove {provider.provider}
        </Button>
      </div>
    </>
  )
}

const LinkedProvider: React.FC = () => {
  const { route } = useOpenfort()

  const provider = useMemo(() => {
    if (route.route === 'linkedProvider') {
      return route.provider
    }
    throw new Error('No provider found in route')
  }, [])

  const getProviderDetails = (provider: UserAccount) => {
    switch (provider.provider) {
      case 'siwe':
        return <SiweContent provider={provider} />
      case 'google':
      case 'facebook':
      case 'twitter':
        return <OAuthContent provider={provider} />
      default:
        return (
          <div
            style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'column' }}
          >
            <div>
              Authentication method: <b>{getProviderName(provider.provider)}</b>
            </div>
            <FitText>
              <ProviderHeader provider={provider} />
            </FitText>
          </div>
        )
    }
  }

  return (
    <PageContent>
      <ModalHeading>{getProviderName(provider.provider)}</ModalHeading>
      <ModalContent style={{ paddingBottom: 0 }}>
        <ProviderIconContainer>
          <ProviderIconWrapper>
            <ProviderIconInner>
              <ProviderIcon provider={provider} />
            </ProviderIconInner>
          </ProviderIconWrapper>
        </ProviderIconContainer>
        <ModalBody>{getProviderDetails(provider)}</ModalBody>
      </ModalContent>
    </PageContent>
  )
}

export default LinkedProvider
