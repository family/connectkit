import { useMemo } from 'react'
import { EmailIcon, PhoneIcon, WalletIcon } from '../../../assets/icons'
import Logos, { providersLogos } from '../../../assets/logos'
import type { UserAccount } from '../../../openfortCustomTypes'
import { useWagmiWallets } from '../../../wallets/useWagmiWallets'
import FitText from '../../Common/FitText'

const WalletIconWrapper: React.FC<{ provider: UserAccount }> = ({ provider }) => {
  const wallets = useWagmiWallets()
  const wallet = useMemo(() => {
    return wallets.find((w) => w.id?.toLowerCase() === provider.walletClientType)
  }, [provider])

  if (provider.walletClientType === 'walletconnect') return <Logos.WalletConnect />

  if (wallet) return <>{wallet.iconConnector ?? wallet.icon}</>

  return <WalletIcon />
}

export const ProviderIcon: React.FC<{ provider: UserAccount }> = ({ provider }) => {
  switch (provider.provider) {
    case 'email':
    case 'credential':
      return <EmailIcon />
    // OTP_TODO: Wallet icon
    case 'wallet':
    case 'siwe':
      return <WalletIconWrapper provider={provider} />
    case 'phone':
      return <PhoneIcon />
    case 'google':
    case 'twitter':
    case 'facebook':
      return providersLogos[provider.provider]
    default:
      return <FitText>{provider.provider.substring(0, 4).toUpperCase()}</FitText>
  }
}
