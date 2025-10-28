import { useEffect, useMemo } from 'react'
import { formatUnits } from 'viem'
import { type TokenOptionWithBalance, useTokens } from '../../../hooks/useTokens'
import { ModalBody, ModalH1 } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { formatBalanceWithSymbol, isSameToken } from '../Send/utils'
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
  const { setSendForm, setRoute, triggerResize } = useOpenfort()
  const { tokenOptions, isLoading, prices: usdPrices } = useTokens()

  const selectableTokens = useMemo(
    () => tokenOptions.filter((token) => (token.balanceValue ?? ZERO) > ZERO),
    [tokenOptions]
  )

  const handleSelect = (token: TokenOptionWithBalance) => {
    setSendForm((prev) => {
      const shouldResetAmount = !isSameToken(prev.token, token)
      return {
        ...prev,
        token,
        amount: shouldResetAmount ? '' : prev.amount,
      }
    })
    setRoute(routes.SEND)
  }

  useEffect(() => {
    triggerResize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, selectableTokens.length])

  const renderContent = () => {
    if (isLoading) {
      return <EmptyState>Loading balances…</EmptyState>
    }

    if (!selectableTokens.length) {
      return <EmptyState>No tokens with a balance on this network.</EmptyState>
    }

    return (
      <TokenList>
        {selectableTokens.map((token) => {
          const key = token.type === 'erc20' ? token.address : 'native'
          const displayName = token.name || token.symbol
          const symbolKey = token.symbol?.toUpperCase()
          const pricePerToken = symbolKey ? usdPrices[symbolKey] : undefined
          let usdValue: string | null = null

          if (pricePerToken !== undefined && token.balanceValue !== undefined) {
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
            <TokenButton key={key} type="button" onClick={() => handleSelect(token)}>
              <TokenInfo>
                <TokenSymbol>{displayName}</TokenSymbol>
                {usdValue ? <TokenName>{usdValue}</TokenName> : null}
              </TokenInfo>
              <TokenBalance>{formatBalanceWithSymbol(token.balanceValue, token.decimals, token.symbol)}</TokenBalance>
            </TokenButton>
          )
        })}
      </TokenList>
    )
  }

  return (
    <SelectTokenContent>
      <ModalH1>Select token</ModalH1>
      <ModalBody style={{ marginTop: 8 }}>Only tokens with a balance are shown.</ModalBody>
      {renderContent()}
    </SelectTokenContent>
  )
}

export default SelectToken
