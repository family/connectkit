import { useEffect, useMemo } from 'react'
import { ModalBody, ModalH1 } from '../../Common/Modal/styles'
import { type BuyProviderId, routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { getProviderQuotes, getProviders } from '../Buy/providers'
import { createCurrencyFormatter } from '../Buy/utils'
import { sanitiseForParsing, sanitizeAmountInput } from '../Send/utils'
import {
  EmptyState,
  ProviderBadge,
  ProviderButton,
  ProviderFiat,
  ProviderInfo,
  ProviderList,
  ProviderMeta,
  ProviderName,
  ProviderNameRow,
  ProviderQuote,
  ProviderRight,
  ProviderSelectContent,
} from './styles'

const BuyProviderSelect = () => {
  const { buyForm, setBuyForm, setRoute, triggerResize } = useOpenfort()

  const providers = getProviders()

  const normalizedAmount = sanitiseForParsing(sanitizeAmountInput(buyForm.amount))

  const fiatAmount = useMemo(() => {
    if (!normalizedAmount) return null
    const numeric = Number(normalizedAmount)
    if (!Number.isFinite(numeric)) return null
    return numeric
  }, [normalizedAmount])

  const quotes = useMemo(() => getProviderQuotes(fiatAmount), [fiatAmount])
  useEffect(() => {
    triggerResize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotes.length])
  const currencyFormatter = useMemo(() => createCurrencyFormatter(buyForm.currency), [buyForm.currency])

  const tokenSymbol = buyForm.token.symbol || 'Token'

  const handleSelect = (id: BuyProviderId) => {
    setBuyForm((prev) => ({
      ...prev,
      providerId: id,
    }))
    setRoute(routes.BUY)
  }

  const renderProviders = () => {
    if (!providers.length) {
      return <EmptyState>No providers available right now.</EmptyState>
    }

    return (
      <ProviderList>
        {providers.map((provider) => {
          const quote = quotes.find((item) => item.provider.id === provider.id)
          const netDisplay = quote && quote.netAmount !== null ? `${quote.netAmount.toFixed(2)} ${tokenSymbol}` : '--'
          const fiatDisplay = fiatAmount !== null ? currencyFormatter.format(fiatAmount) : '--'
          const feePercentage = (provider.feeBps / 100).toFixed(2)
          const highlight =
            provider.highlight === 'best' ? 'Best price' : provider.highlight === 'fast' ? 'Fastest' : null

          const metaText = `Fee ${feePercentage}%`

          const isActive = buyForm.providerId === provider.id

          return (
            <ProviderButton
              key={provider.id}
              type="button"
              onClick={() => handleSelect(provider.id)}
              $active={isActive}
            >
              <ProviderInfo>
                <ProviderNameRow>
                  <ProviderName>{provider.name}</ProviderName>
                  {highlight ? <ProviderBadge>{highlight}</ProviderBadge> : null}
                </ProviderNameRow>
                <ProviderMeta>{metaText}</ProviderMeta>
              </ProviderInfo>
              <ProviderRight>
                <ProviderQuote>{netDisplay}</ProviderQuote>
                <ProviderFiat>{fiatDisplay}</ProviderFiat>
              </ProviderRight>
            </ProviderButton>
          )
        })}
      </ProviderList>
    )
  }

  return (
    <ProviderSelectContent>
      <ModalH1>Choose provider</ModalH1>
      <ModalBody style={{ marginTop: 8 }}>Compare quotes and pick the provider that works best for you.</ModalBody>
      {renderProviders()}
    </ProviderSelectContent>
  )
}

export default BuyProviderSelect
