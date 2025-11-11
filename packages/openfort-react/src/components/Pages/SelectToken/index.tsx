import { useEffect } from 'react'
import { formatUnits } from 'viem'
import { useWalletAssets } from '../../../hooks/openfort/useWalletAssets'
import { Arrow, ArrowChevron } from '../../Common/Button/styles'
import { ModalBody, ModalHeading } from '../../Common/Modal/styles'
import { type Asset, routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { formatBalanceWithSymbol } from '../Send/utils'
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

const SelectToken = () => {
  const { route, setSendForm, setBuyForm, setRoute, triggerResize } = useOpenfort()

  const { data: walletAssets, isLoading: isBalancesLoading } = useWalletAssets()

  const isBuyFlow = route.route === routes.BUY_TOKEN_SELECT

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          const displayName = (token.metadata?.name as string) || (token.metadata?.symbol as string) || 'Unknown Token'
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
                {usdValue ? <TokenName>{usdValue}</TokenName> : null}
              </TokenInfo>
              {isBuyFlow ? (
                <Arrow width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ArrowChevron stroke="currentColor" d="M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314" />
                </Arrow>
              ) : (
                <TokenBalance>{balanceDisplay}</TokenBalance>
              )}
            </TokenButton>
          )
        })}
      </TokenList>
    )
  }

  return (
    <SelectTokenContent>
      <ModalHeading>Select token</ModalHeading>
      <ModalBody>
        {isBuyFlow
          ? 'Choose the token you want to purchase.'
          : isBalancesLoading
            ? 'Loading token balances...'
            : 'Tokens without a balance are dimmed.'}
      </ModalBody>
      {renderContent()}
    </SelectTokenContent>
  )
}

export default SelectToken
