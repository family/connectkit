import { RecoveryMethod } from '@openfort/openfort-js'
import { useEnsName } from 'wagmi'
import { FingerPrintIcon, KeyIcon, LockIcon } from '../../../assets/icons'
import { embeddedWalletId } from '../../../constants/openfort'
import { type UserWallet, useWallets } from '../../../hooks/openfort/useWallets'
import { useEnsFallbackConfig } from '../../../hooks/useEnsFallbackConfig'
import { truncateEthAddress } from '../../../utils'
import { walletConfigs } from '../../../wallets/walletConfigs'
import Button from '../../Common/Button'
import { ModalHeading } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { ProviderIcon, ProviderLabel, ProvidersButton } from '../Providers/styles'

const WalletRecoveryIcon = ({ recovery }: { recovery: RecoveryMethod | undefined }) => {
  switch (recovery) {
    case RecoveryMethod.PASSWORD:
      return <KeyIcon />
    case RecoveryMethod.PASSKEY:
      return <FingerPrintIcon />
    case RecoveryMethod.AUTOMATIC:
      return <LockIcon />
    default:
      return null
  }
}
const SelectWalletButton = ({ wallet }: { wallet: UserWallet }) => {
  const ensFallbackConfig = useEnsFallbackConfig()
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: wallet.address,
    config: ensFallbackConfig,
  })
  const walletDisplay = ensName ?? truncateEthAddress(wallet.address)
  const { setRoute, setConnector } = useOpenfort()

  const walletIcon = () => {
    if (wallet.id === embeddedWalletId) {
      return <WalletRecoveryIcon recovery={wallet.recoveryMethod} />
    }
    const walletConfig = Object.entries(walletConfigs).find(([key]) => {
      return key.includes(wallet.id)
    })?.[1]

    if (walletConfig) {
      return walletConfig.icon
    }
  }

  return (
    <ProvidersButton>
      <Button
        onClick={() => {
          if (wallet.id === embeddedWalletId) {
            setRoute({ route: routes.RECOVER_WALLET, wallet })
          } else {
            setRoute({ route: routes.CONNECT, connectType: 'recover', wallet })
            setConnector({ id: wallet.id })
          }
        }}
      >
        <ProviderLabel>{walletDisplay}</ProviderLabel>
        <ProviderIcon>{walletIcon()}</ProviderIcon>
      </Button>
    </ProvidersButton>
  )
}
const SelectWalletToRecover: React.FC = () => {
  const { wallets } = useWallets()

  return (
    <PageContent onBack={routes.PROVIDERS} logoutOnBack>
      <ModalHeading>Select a wallet to recover</ModalHeading>
      {wallets.map((wallet) => (
        <SelectWalletButton key={wallet.address} wallet={wallet} />
      ))}
    </PageContent>
  )
}

export default SelectWalletToRecover
