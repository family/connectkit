import { AnimatePresence, motion } from 'framer-motion'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { formatUnits } from 'viem'
import { useAccount, useChainId, useEnsName } from 'wagmi'
import { BuyIcon, ReceiveIcon, SendIcon, UserRoundIcon } from '../../../assets/icons'
import { useWalletAssets } from '../../../hooks/openfort/useWalletAssets'
import { useChains } from '../../../hooks/useChains'
import { useEnsFallbackConfig } from '../../../hooks/useEnsFallbackConfig'
import { nFormatter, truncateEthAddress } from '../../../utils'
import Avatar from '../../Common/Avatar'
import Button from '../../Common/Button'
import { TextLinkButton } from '../../Common/Button/styles'
import ChainSelector from '../../Common/ChainSelect'
import { CopyText } from '../../Common/CopyToClipboard/CopyText'
import { ModalBody, ModalContent, ModalH1 } from '../../Common/Modal/styles'
import PoweredByFooter from '../../Common/PoweredByFooter'
import { useThemeContext } from '../../ConnectKitThemeProvider/ConnectKitThemeProvider'
import { defaultSendFormState, routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { getAssetDecimals } from '../Send/utils'
import {
  ActionButton,
  ActionButtonsContainer,
  AvatarContainer,
  AvatarInner,
  Balance,
  BalanceContainer,
  ChainSelectorContainer,
  LinkedProvidersToggle,
  LoadingBalance,
  Unsupported,
} from './styles'

const Connected = () => {
  const context = useOpenfort()
  const themeContext = useThemeContext()
  const { setHeaderLeftSlot, setRoute } = context

  const { address } = useAccount()
  const chainId = useChainId()
  const chains = useChains()
  const chain = chains.find((c) => c.id === chainId)
  const ensFallbackConfig = useEnsFallbackConfig()
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: address,
    config: ensFallbackConfig,
  })

  const { data: assets, isLoading, refetch } = useWalletAssets()
  const totalBalanceUsd = useMemo(() => {
    if (!assets) return 0
    return assets.reduce((acc, asset) => {
      if (!asset.metadata || !asset.balance) return acc
      const price: number = asset.metadata?.fiat?.value ?? 0
      if (!price) return acc
      const balance = Number(formatUnits(asset.balance ?? BigInt(0), getAssetDecimals(asset)))
      return acc + price * balance
    }, 0)
  }, [assets])

  useEffect(() => {
    refetch()
  }, [])

  const isTestnet = chain?.testnet ?? false
  const [showTestnetMessage, setShowTestnetMessage] = useState(false)

  useEffect(() => {
    context.triggerResize()

    if (showTestnetMessage) {
      const timer = setTimeout(() => {
        setShowTestnetMessage(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showTestnetMessage])

  const handleBuyClick = (e: React.MouseEvent) => {
    if (!chain || isTestnet) {
      e.preventDefault()
      setShowTestnetMessage(true)
    } else {
      // console.log('Buy is only available on mainnet chains')
      context.setRoute(routes.BUY)
    }
  }

  useEffect(() => {
    if (!address) {
      setHeaderLeftSlot(null)
      return
    }

    setHeaderLeftSlot(
      <LinkedProvidersToggle
        type="button"
        onClick={() => setRoute(routes.LINKED_PROVIDERS)}
        aria-label="Profile"
        title="Profile"
      >
        <UserRoundIcon />
      </LinkedProvidersToggle>
    )

    return () => {
      setHeaderLeftSlot(null)
    }
  }, [address])

  const { setSendForm } = context

  const separator = ['web95', 'rounded', 'minimal'].includes(themeContext.theme ?? context.uiConfig.theme ?? '')
    ? '....'
    : undefined

  return (
    <PageContent onBack={null}>
      <ModalContent style={{ paddingBottom: 6, gap: 6 }}>
        {address ? (
          <>
            <AvatarContainer>
              <AvatarInner>
                <ChainSelectorContainer>
                  <ChainSelector />
                </ChainSelectorContainer>
                <Avatar address={address} />
              </AvatarInner>
            </AvatarContainer>
            <ModalH1>
              <CopyText value={address}>{ensName ?? truncateEthAddress(address, separator)}</CopyText>
            </ModalH1>
            {context?.uiConfig.hideBalance ? null : (
              <ModalBody>
                <BalanceContainer>
                  {!!assets && !isLoading && (
                    <TextLinkButton
                      type="button"
                      onClick={() => {
                        const firstBalanceAsset = assets?.find((a) => a.balance && a.balance > BigInt(0))
                        if (!firstBalanceAsset) {
                          setRoute(routes.NO_ASSETS_AVAILABLE)
                          return
                        }
                        setRoute(routes.ASSET_INVENTORY)
                      }}
                    >
                      <Balance
                        key={`chain-${chain?.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ${nFormatter(totalBalanceUsd)}
                      </Balance>
                    </TextLinkButton>
                  )}
                  {isLoading && (
                    <LoadingBalance
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      &nbsp;
                    </LoadingBalance>
                  )}
                </BalanceContainer>
                <ActionButtonsContainer>
                  <ActionButton
                    icon={<SendIcon />}
                    onClick={() => {
                      const firstBalanceAsset = assets?.find((a) => a.balance && a.balance > BigInt(0))
                      if (!firstBalanceAsset) {
                        setRoute(routes.NO_ASSETS_AVAILABLE)
                        return
                      }

                      setSendForm({ ...defaultSendFormState, asset: firstBalanceAsset })
                      context.setRoute(routes.SEND)
                    }}
                  >
                    Send
                  </ActionButton>
                  <ActionButton
                    icon={<ReceiveIcon />}
                    onClick={() => {
                      context.setRoute(routes.RECEIVE)
                    }}
                  >
                    Get
                  </ActionButton>
                  <ActionButton
                    icon={<BuyIcon />}
                    onClick={handleBuyClick}
                    style={isTestnet ? { cursor: 'not-allowed', opacity: 0.4, pointerEvents: 'auto' } : undefined}
                  >
                    Buy
                  </ActionButton>
                </ActionButtonsContainer>
                <AnimatePresence onExitComplete={() => context.triggerResize()}>
                  {showTestnetMessage && (
                    <ModalBody
                      as={motion.div}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 0.7, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      style={{ marginTop: 12, fontSize: 14, textAlign: 'center' }}
                    >
                      Buy is only available on mainnet chains
                    </ModalBody>
                  )}
                </AnimatePresence>
              </ModalBody>
            )}
          </>
        ) : (
          <Button
            onClick={() => context.setRoute({ route: routes.CONNECTORS, connectType: 'link' })}
            icon={
              <Unsupported initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <svg width="130" height="120" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <title>Unsupported wallet icon</title>
                  <path
                    d="M2.61317 11.2501H9.46246C10.6009 11.2501 11.3256 10.3506 11.3256 9.3549C11.3256 9.05145 11.255 8.73244 11.0881 8.43303L7.65903 2.14708C7.659 2.14702 7.65897 2.14696 7.65893 2.1469C7.65889 2.14682 7.65884 2.14673 7.65879 2.14664C7.31045 1.50746 6.6741 1.17871 6.04 1.17871C5.41478 1.17871 4.763 1.50043 4.41518 2.14968L0.993416 8.43476C0.828865 8.72426 0.75 9.04297 0.75 9.3549C0.75 10.3506 1.47471 11.2501 2.61317 11.2501Z"
                    fill="currentColor"
                    stroke="var(--ck-body-background, #fff)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6.03258 7.43916C5.77502 7.43916 5.63096 7.29153 5.62223 7.02311L5.55675 4.96973C5.54802 4.69684 5.74446 4.5 6.02821 4.5C6.3076 4.5 6.51277 4.70131 6.50404 4.9742L6.43856 7.01864C6.42546 7.29153 6.2814 7.43916 6.03258 7.43916ZM6.03258 9.11676C5.7401 9.11676 5.5 8.9065 5.5 8.60677C5.5 8.30704 5.7401 8.09678 6.03258 8.09678C6.32506 8.09678 6.56515 8.30256 6.56515 8.60677C6.56515 8.91097 6.32069 9.11676 6.03258 9.11676Z"
                    fill="white"
                  />
                </svg>
              </Unsupported>
            }
          >
            Connect wallet
          </Button>
        )}
      </ModalContent>
      <PoweredByFooter />
    </PageContent>
  )
}

export default Connected
