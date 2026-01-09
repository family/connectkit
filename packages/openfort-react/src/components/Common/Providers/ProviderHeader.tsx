import type { Hex } from 'viem'
import { useEnsName } from 'wagmi'
import { useUser } from '../../../hooks/openfort/useUser'
import { useEnsFallbackConfig } from '../../../hooks/useEnsFallbackConfig'
import type { UserAccount } from '../../../openfortCustomTypes'
import { truncateEthAddress } from '../../../utils'
import { useThemeContext } from '../../ConnectKitThemeProvider/ConnectKitThemeProvider'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { LinkedProviderText } from '../../Pages/LinkedProviders/styles'

export const WalletDisplay = ({ walletAddress }: { walletAddress: string }) => {
  const ensFallbackConfig = useEnsFallbackConfig()
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: walletAddress as Hex,
    config: ensFallbackConfig,
  })
  const context = useOpenfort()
  const themeContext = useThemeContext()

  const separator = ['web95', 'rounded', 'minimal'].includes(themeContext.theme ?? context.uiConfig.theme ?? '')
    ? '....'
    : undefined

  return ensName ?? truncateEthAddress(walletAddress, separator)
}

export const ProviderHeader: React.FC<{ provider: UserAccount }> = ({ provider }) => {
  const { user } = useUser()
  switch (provider.provider) {
    case 'wallet':
    case 'siwe':
      return (
        <LinkedProviderText>
          <WalletDisplay walletAddress={provider.accountId!} />
        </LinkedProviderText>
      )
    case 'phone':
      return <LinkedProviderText>{provider.accountId}</LinkedProviderText>
    default:
      return (
        <LinkedProviderText style={{ textTransform: user?.email ? 'none' : 'capitalize' }}>
          {user?.email ?? provider.provider}
        </LinkedProviderText>
      )
  }
}
