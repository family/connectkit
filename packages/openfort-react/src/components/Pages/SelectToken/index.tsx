import { useEffect, useMemo } from 'react'
import { ModalBody, ModalH1 } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { type TokenOptionWithBalance, useSendTokenOptions } from '../Send/useSendTokenOptions'
import { formatBalance, isSameToken } from '../Send/utils'
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

const SelectToken = () => {
  const { setSendForm, setRoute, triggerResize } = useOpenfort()
  const { tokenOptions, isLoading } = useSendTokenOptions()

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
          return (
            <TokenButton key={key} type="button" onClick={() => handleSelect(token)}>
              <TokenInfo>
                <TokenSymbol>{token.symbol}</TokenSymbol>
                {token.type === 'erc20' && token.name ? <TokenName>{token.name}</TokenName> : null}
              </TokenInfo>
              <TokenBalance>{formatBalance(token.balanceValue, token.decimals)}</TokenBalance>
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
