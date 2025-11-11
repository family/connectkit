import { formatUnits } from 'viem'
import { useWalletAssets } from '../../../hooks/openfort/useWalletAssets'
import { ModalHeading } from '../../Common/Modal/styles'
import { EmptyState } from '../BuyProviderSelect/styles'
import {
  SelectTokenContent,
  TokenBalance,
  TokenContainer,
  TokenInfo,
  TokenList,
  TokenName,
  TokenSymbol,
} from '../SelectToken/styles'
import { formatBalanceWithSymbol, getAssetSymbol } from '../Send/utils'

const ZERO = BigInt(0)
const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const AssetInventory = () => {
  const { data: walletAssets, isLoading: isBalancesLoading } = useWalletAssets()

  // Show all tokens for both buy and send flows
  const selectableTokens = walletAssets || []

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

          const pricePerToken = (token.metadata as any)?.fiat?.value
          let usdValue: string | null = null

          // Show loading state for balances
          const isBalanceLoaded = token.balance !== undefined
          const balanceDisplay = isBalanceLoaded
            ? formatBalanceWithSymbol(token.balance, decimals, token.metadata?.symbol as string)
            : 'Loading...'

          // Check if token has zero balance (for send flow opacity)
          const hasZeroBalance = isBalanceLoaded && (token.balance ?? ZERO) <= ZERO

          if (hasZeroBalance) return null

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
            <TokenContainer key={key}>
              <TokenInfo>
                <TokenSymbol>{displayName}</TokenSymbol>
                {/* <TokenName>{displaySymbol}</TokenName> */}
              </TokenInfo>
              <TokenInfo>
                <TokenBalance>{balanceDisplay}</TokenBalance>
                {usdValue ? <TokenName style={{ textAlign: 'end' }}>{usdValue}</TokenName> : null}
              </TokenInfo>
            </TokenContainer>
          )
        })}
      </TokenList>
    )
  }

  return (
    <SelectTokenContent>
      <ModalHeading>Your assets</ModalHeading>
      {renderContent()}
    </SelectTokenContent>
  )
}
