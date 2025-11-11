import { useEffect, useState } from 'react'
import { formatUnits } from 'viem'
import { useWalletAssets } from '../../../hooks/openfort/useWalletAssets'
import { Arrow, ArrowChevron, TextLinkButton } from '../../Common/Button/styles'
import { ModalHeading } from '../../Common/Modal/styles'
import { type Asset, routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { formatBalanceWithSymbol, getAssetSymbol } from '../Send/utils'
import {
  EmptyState,
  SelectTokenContent,
  TokenBalance,
  TokenButton,
  TokenInfo,
  TokenList,
  TokenName,
  TokenSymbol,
} from './styles'

const ZERO = BigInt(0)
const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const SelectToken = ({ isBuyFlow }: { isBuyFlow: boolean }) => {
  const { setSendForm, setBuyForm, setRoute, triggerResize } = useOpenfort()

  const [viewAllAssets, setViewAllAssets] = useState(false)

  useEffect(() => {
    triggerResize()
  }, [viewAllAssets])

  const { data: walletAssets, isLoading: isBalancesLoading } = useWalletAssets()

  // Show all tokens for both buy and send flows
  const selectableTokens = walletAssets || []

  const handleSelect = (asset: Asset) => {
    // In send flow, don't allow selecting tokens with 0 balance
    if (!isBuyFlow && (asset.balance ?? ZERO) <= ZERO) {
      return
    }

    if (isBuyFlow) {
      setBuyForm((prev) => ({
        ...prev,
        asset,
      }))
      setRoute(routes.BUY)
      return
    }

    setSendForm((prev) => ({
      ...prev,
      asset,
      amount: '', // Always reset amount when selecting a token
    }))
    setRoute(routes.SEND)
  }

  useEffect(() => {
    triggerResize()
  }, [selectableTokens.length, isBuyFlow])

  const renderContent = () => {
    if (!selectableTokens.length) {
      if (isBalancesLoading) {
        return <EmptyState>Loading balances…</EmptyState>
      }
      return <EmptyState>No supported tokens found for this network yet.</EmptyState>
    }

    return (
      <TokenList>
        {selectableTokens.map((token) => {
          const key = token.type === 'erc20' ? token.address : 'native'
          const displaySymbol = getAssetSymbol(token)
          const displayName = (token.metadata?.name as string) || displaySymbol || 'Unknown Token'
          // const symbolKey = token.metadata?.symbol?.toUpperCase()
          const decimals = token.metadata && 'decimals' in token.metadata ? (token.metadata.decimals as number) : 18

          const pricePerToken = token.type === 'native' ? (token.metadata as any)?.fiat?.value : undefined
          let usdValue: string | null = null

          // Show loading state for balances
          const isBalanceLoaded = token.balance !== undefined
          const balanceDisplay = isBalanceLoaded
            ? formatBalanceWithSymbol(token.balance, decimals, token.metadata?.symbol as string)
            : 'Loading...'

          // Check if token has zero balance (for send flow opacity)
          const hasZeroBalance = isBalanceLoaded && (token.balance ?? ZERO) <= ZERO

          if (hasZeroBalance && !viewAllAssets && !isBuyFlow) return null

          const isDisabled = !isBuyFlow && hasZeroBalance

          if (isBalanceLoaded && pricePerToken !== undefined && token.balance !== undefined) {
            const amount = parseFloat(formatUnits(token.balance, decimals))
            if (Number.isFinite(amount)) {
              const totalUsd = amount * pricePerToken
              if (totalUsd >= 0.01) {
                usdValue = usdFormatter.format(totalUsd)
              } else if (totalUsd > 0) {
                usdValue = '<$0.01'
              } else {
                usdValue = usdFormatter.format(0)
              }
            }
          }

          return (
            <TokenButton
              key={key}
              type="button"
              onClick={() => handleSelect(token)}
              style={{ opacity: isDisabled ? 0.4 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
            >
              <TokenInfo>
                <TokenSymbol>{displayName}</TokenSymbol>
                {isBuyFlow && <TokenName>{displaySymbol}</TokenName>}
              </TokenInfo>
              {isBuyFlow ? (
                <Arrow width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ArrowChevron stroke="currentColor" d="M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314" />
                </Arrow>
              ) : (
                <TokenInfo>
                  <TokenBalance>{balanceDisplay}</TokenBalance>
                  {usdValue ? <TokenName>{usdValue}</TokenName> : null}
                </TokenInfo>
              )}
            </TokenButton>
          )
        })}
        {!isBuyFlow && (
          <TextLinkButton
            type="button"
            onClick={() => {
              setViewAllAssets(!viewAllAssets)
            }}
          >
            {viewAllAssets ? 'View less assets' : 'View all assets'}
          </TextLinkButton>
        )}
      </TokenList>
    )
  }

  return (
    <SelectTokenContent>
      <ModalHeading>Select asset</ModalHeading>
      {renderContent()}
    </SelectTokenContent>
  )
}

export default SelectToken
