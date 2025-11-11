import type React from 'react'
import useLocales from '../../../hooks/useLocales'
import { useWalletConnectModal } from '../../../hooks/useWalletConnectModal'
import { useWagmiWallets } from '../../../wallets/useWagmiWallets'
import { walletConfigs } from '../../../wallets/walletConfigs'
import { CopyButton } from '../../Common/CopyToClipboard/CopyButton'
import { ModalContent } from '../../Common/Modal/styles'
import { ScrollArea } from '../../Common/ScrollArea'
import { Spinner } from '../../Common/Spinner'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { Container, WalletIcon, WalletItem, WalletLabel, WalletList } from './styles'

const MoreIcon = (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>More wallets icon</title>
    <path d="M30 42V19M19 30.5H42" stroke="var(--ck-body-color-muted)" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

const MobileConnectors: React.FC = () => {
  const context = useOpenfort()
  const locales = useLocales()

  const { open: openW3M, isOpen: isOpenW3M } = useWalletConnectModal()
  const wallets = useWagmiWallets()

  // filter out installed wallets
  const walletsIdsToDisplay =
    Object.keys(walletConfigs).filter((walletId) => {
      const wallet = walletConfigs[walletId]
      if (wallets.find((w) => w.connector.id === walletId)) return false
      if (!wallet.getWalletConnectDeeplink) return false
      return true
    }) ?? []

  const connectWallet = (walletId: string) => {
    context.setRoute(routes.CONNECT_WITH_MOBILE)
    context.setConnector({ id: walletId })
  }

  return (
    <PageContent width={312} onBack={routes.PROVIDERS}>
      <Container>
        <ModalContent style={{ paddingBottom: 0 }}>
          <ScrollArea height={340}>
            <WalletList>
              {walletsIdsToDisplay
                .sort(
                  // sort by name
                  (a, b) => {
                    const walletA = walletConfigs[a]
                    const walletB = walletConfigs[b]
                    const nameA = walletA.name ?? walletA.shortName ?? a
                    const nameB = walletB.name ?? walletB.shortName ?? b
                    return nameA.localeCompare(nameB)
                  }
                )
                .filter((walletId) => !(walletId === 'coinbaseWallet' || walletId === 'com.coinbase.wallet'))
                .map((walletId, i) => {
                  const wallet = walletConfigs[walletId]
                  const { name, shortName, iconConnector, icon } = wallet
                  return (
                    <WalletItem
                      key={walletId}
                      onClick={() => connectWallet(walletId)}
                      style={{
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      <WalletIcon $outline={true}>{iconConnector ?? icon}</WalletIcon>
                      <WalletLabel>{shortName ?? name}</WalletLabel>
                    </WalletItem>
                  )
                })}
              <WalletItem onClick={openW3M} $waiting={isOpenW3M}>
                <WalletIcon style={{ background: 'var(--ck-body-background-secondary)' }}>
                  {isOpenW3M ? (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                        }}
                      >
                        <Spinner />
                      </div>
                    </div>
                  ) : (
                    MoreIcon
                  )}
                </WalletIcon>
                <WalletLabel>{locales.more}</WalletLabel>
              </WalletItem>
            </WalletList>
          </ScrollArea>
        </ModalContent>
        {context.uiConfig.walletConnectCTA !== 'modal' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              paddingTop: 8,
            }}
          >
            <CopyButton value="">{locales.copyToClipboard}</CopyButton>
          </div>
        )}
      </Container>
    </PageContent>
  )
}

export default MobileConnectors
