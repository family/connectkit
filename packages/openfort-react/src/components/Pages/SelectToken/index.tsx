import { useEffect } from 'react'
import { formatUnits } from 'viem'
import { type TokenOptionWithBalance, useTokens } from '../../../hooks/useTokens'
import { ModalBody, ModalH1 } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
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

  const { tokenOptions, isBalancesLoading, prices: usdPrices } = useTokens()

  const isBuyFlow = route.route === routes.BUY_TOKEN_SELECT

  // Show all tokens for both buy and send flows
  const selectableTokens = tokenOptions

  const handleSelect = (token: TokenOptionWithBalance) => {
    // In send flow, don't allow selecting tokens with 0 balance
    if (!isBuyFlow && (token.balanceValue ?? ZERO) <= ZERO) {
      return
    }

    if (isBuyFlow) {
      setBuyForm((prev) => ({
        ...prev,
        token,
      }))
      setRoute(routes.BUY)
      return
    }

    setSendForm((prev) => ({
      ...prev,
      token,
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
          const displayName = token.name || token.symbol
          const symbolKey = token.symbol?.toUpperCase()
          const pricePerToken = symbolKey ? usdPrices[symbolKey] : undefined
          let usdValue: string | null = null

          // Show loading state for balances
          const isBalanceLoaded = token.balanceValue !== undefined
          const balanceDisplay = isBalanceLoaded
            ? formatBalanceWithSymbol(token.balanceValue, token.decimals, token.symbol)
            : 'Loading...'

          // Check if token has zero balance (for send flow opacity)
          const hasZeroBalance = isBalanceLoaded && (token.balanceValue ?? ZERO) <= ZERO
          const isDisabled = !isBuyFlow && hasZeroBalance

          if (isBalanceLoaded && pricePerToken !== undefined && token.balanceValue !== undefined) {
            const amount = parseFloat(formatUnits(token.balanceValue, token.decimals))
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
              <TokenBalance>{balanceDisplay}</TokenBalance>
            </TokenButton>
          )
        })}
      </TokenList>
    )
  }

  return (
    <SelectTokenContent>
      <ModalH1>Select token</ModalH1>
      <ModalBody style={{ marginTop: 8 }}>
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
