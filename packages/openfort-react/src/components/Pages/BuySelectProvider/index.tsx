import { useEffect, useMemo, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { useTokens } from '../../../hooks/useTokens'
import Button from '../../Common/Button'
import { ModalBody, ModalContent, ModalH1 } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { isCoinbaseSupported } from '../Buy/coinbaseApi'
import type { OnrampQuote } from '../Buy/onrampApi'
import { getAllQuotes } from '../Buy/onrampApi'
import { getProviders } from '../Buy/providers'
import { isStripeSupported } from '../Buy/stripeApi'
import {
  ContinueButtonWrapper,
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
} from '../Buy/styles'
import { createCurrencyFormatter, formatTokenAmount } from '../Buy/utils'
import { isSameToken } from '../Send/utils'

const BuySelectProvider = () => {
  const { buyForm, setBuyForm, setRoute, triggerResize, publishableKey } = useOpenfort()
  const { tokenOptions } = useTokens()
  const { address } = useAccount()
  const chainId = useChainId()
  const [quotes, setQuotes] = useState<Record<string, OnrampQuote>>({})
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [coinbaseError, setCoinbaseError] = useState<boolean>(false)
  const [stripeError, setStripeError] = useState<boolean>(false)
  const [quoteRefreshTimer, setQuoteRefreshTimer] = useState(60)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const fiatAmount = useMemo(() => {
    const normalized = buyForm.amount
    if (!normalized) return null
    const numeric = Number(normalized)
    if (!Number.isFinite(numeric)) return null
    return numeric
  }, [buyForm.amount])

  const matchedToken = useMemo(
    () => tokenOptions.find((token) => isSameToken(token, buyForm.token)),
    [tokenOptions, buyForm.token]
  )

  const selectedTokenOption = matchedToken ?? tokenOptions[0]
  const selectedToken = selectedTokenOption ?? buyForm.token

  const tokenSymbol = selectedToken.symbol || 'Token'
  const currencyFormatter = useMemo(() => createCurrencyFormatter(buyForm.currency), [buyForm.currency])

  // Trigger resize on mount
  useEffect(() => {
    triggerResize()
  }, [triggerResize])

  // Quote refresh timer - counts down from 60 and triggers refetch
  useEffect(() => {
    if (!fiatAmount || fiatAmount <= 0) return

    const interval = setInterval(() => {
      setQuoteRefreshTimer((prev) => {
        if (prev <= 1) {
          setRefetchTrigger((t) => t + 1)
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [fiatAmount])

  // Reset timer when amount changes
  useEffect(() => {
    if (fiatAmount && fiatAmount > 0) {
      setQuoteRefreshTimer(60)
    }
  }, [fiatAmount])

  // Fetch quotes from all providers
  useEffect(() => {
    const fetchQuotes = async () => {
      if (!address || !fiatAmount || fiatAmount <= 0) {
        setQuotes({})
        setCoinbaseError(false)
        setStripeError(false)
        return
      }

      setIsLoadingQuote(true)
      setCoinbaseError(false)
      setStripeError(false)

      try {
        const allQuotes = await getAllQuotes({
          token: selectedToken,
          chainId,
          publishableKey,
          sourceAmount: fiatAmount.toFixed(2),
          sourceCurrency: buyForm.currency,
        })

        const quotesMap: Record<string, OnrampQuote> = {}
        for (const quote of allQuotes) {
          quotesMap[quote.provider] = quote
        }
        setQuotes(quotesMap)

        // Update error states based on which providers returned quotes
        setCoinbaseError(!quotesMap.coinbase && isCoinbaseSupported(selectedToken))
        setStripeError(!quotesMap.stripe && isStripeSupported(selectedToken))
      } catch (_error) {
        setQuotes({})
        setCoinbaseError(true)
        setStripeError(true)
      } finally {
        setIsLoadingQuote(false)
      }
    }

    // Debounce the quote fetching
    const timeoutId = setTimeout(fetchQuotes, 500)
    return () => clearTimeout(timeoutId)
  }, [
    fiatAmount,
    selectedToken.symbol,
    selectedToken.type,
    buyForm.currency,
    chainId,
    address,
    publishableKey,
    refetchTrigger,
  ])

  const handleSelectProvider = (id: string) => {
    setBuyForm((prev) => ({
      ...prev,
      providerId: id as typeof prev.providerId,
    }))
  }

  const handleContinue = () => {
    // Just navigate to the processing screen
    // The processing screen will handle session creation and popup
    setRoute(routes.BUY_PROCESSING)
  }

  const handleBack = () => {
    setRoute(routes.BUY)
  }

  const formattedFiat = fiatAmount !== null ? currencyFormatter.format(fiatAmount) : null
  const step2Disabled = !address || isLoadingQuote

  const providers = getProviders()

  // Find the highest destination amount across all quotes to use as the target
  const targetDestinationAmount = useMemo(() => {
    const amounts = Object.values(quotes)
      .map((q) => Number.parseFloat(q.destinationAmount))
      .filter((n) => Number.isFinite(n))
    return amounts.length > 0 ? Math.max(...amounts) : null
  }, [quotes])

  return (
    <PageContent onBack={handleBack}>
      <ModalContent style={{ paddingBottom: 18, textAlign: 'left' }}>
        <ModalH1>Select Provider</ModalH1>
        <ModalBody style={{ marginTop: 8 }}>{formattedFiat && `Buying ${formattedFiat} of ${tokenSymbol}`}</ModalBody>
        <ModalBody style={{ marginTop: 4, fontSize: '12px', opacity: 0.7 }}>
          {isLoadingQuote ? 'Loading quotes...' : `Quotes refresh in ${quoteRefreshTimer}s`}
        </ModalBody>

        <ProviderList>
          {providers.map((provider) => {
            // Get provider-specific quote data
            const providerQuote = quotes[provider.id]
            let providerNetAmount: number | null = null
            let providerFeePercentage: string | null = null
            let providerFiatAmount: number | null = fiatAmount
            let isDisabled = false
            let disabledReason = ''
            let isEstimated = false

            if (provider.id === 'coinbase') {
              // Check if token is supported
              if (!isCoinbaseSupported(selectedToken)) {
                isDisabled = true
                disabledReason = 'Token not supported'
              } else if (coinbaseError) {
                isDisabled = true
                disabledReason = 'Provider not supported'
              } else if (providerQuote) {
                const originalDestinationAmount = Number.parseFloat(providerQuote.destinationAmount)

                // Normalize to target destination amount
                if (
                  targetDestinationAmount !== null &&
                  Math.abs(originalDestinationAmount - targetDestinationAmount) > 0.000001
                ) {
                  // Amounts differ, need to estimate
                  isEstimated = true
                  providerNetAmount = targetDestinationAmount

                  // Estimate the cost: base amount + scaled fees
                  // Formula: baseAmount + (fees × (targetAmount / originalAmount))
                  const totalFees =
                    providerQuote.fees?.reduce((sum, fee) => sum + Number.parseFloat(fee.amount), 0) ?? 0
                  const baseAmount = fiatAmount ?? 0
                  const ratio = targetDestinationAmount / originalDestinationAmount
                  const estimatedFees = totalFees * ratio
                  providerFiatAmount = baseAmount + estimatedFees

                  // Recalculate fee percentage based on estimated fees
                  providerFeePercentage = baseAmount > 0 ? ((estimatedFees / baseAmount) * 100).toFixed(2) : null
                } else {
                  // Amounts match, use actual quote
                  providerNetAmount = originalDestinationAmount
                  const totalFees =
                    providerQuote.fees?.reduce((sum, fee) => sum + Number.parseFloat(fee.amount), 0) ?? 0
                  providerFeePercentage = fiatAmount ? ((totalFees / fiatAmount) * 100).toFixed(2) : null
                  const sourceAmount = Number.parseFloat(providerQuote.sourceAmount)
                  providerFiatAmount = sourceAmount + totalFees
                }
              }
            } else if (provider.id === 'stripe') {
              // Check if token is supported
              if (!isStripeSupported(selectedToken)) {
                isDisabled = true
                disabledReason = 'Token not supported'
              } else if (stripeError) {
                isDisabled = true
                disabledReason = 'Provider not supported'
              } else if (providerQuote) {
                // Stripe quote is always used as-is (it typically has the best rate)
                providerNetAmount = Number.parseFloat(providerQuote.destinationAmount)
                // Use sourceAmount to show the actual total the user will pay
                providerFiatAmount = Number.parseFloat(providerQuote.sourceAmount)
                // Calculate total fees
                const totalFees = providerQuote.fees?.reduce((sum, fee) => sum + Number.parseFloat(fee.amount), 0) ?? 0
                providerFeePercentage = fiatAmount ? ((totalFees / fiatAmount) * 100).toFixed(2) : null
              }
            }

            // Use real quote data if available, otherwise show loading or fallback
            const netDisplay = isDisabled
              ? disabledReason
              : isLoadingQuote
                ? '...'
                : providerNetAmount !== null
                  ? formatTokenAmount(providerNetAmount, tokenSymbol)
                  : '--'
            const fiatDisplay = isDisabled
              ? ''
              : providerFiatAmount !== null
                ? `${isEstimated ? '~' : ''}${currencyFormatter.format(providerFiatAmount)}`
                : '--'

            // Use real fee percentage if available
            const feePercentage = providerFeePercentage ?? (provider.feeBps / 100).toFixed(2)
            const highlight =
              provider.highlight === 'best' ? 'Best price' : provider.highlight === 'fast' ? 'Fastest' : null

            const metaText = isDisabled ? '' : `Fee ${isEstimated ? '~' : ''}${feePercentage}%`

            const isActive = buyForm.providerId === provider.id

            return (
              <ProviderButton
                key={provider.id}
                type="button"
                onClick={() => !isDisabled && handleSelectProvider(provider.id)}
                $active={isActive}
                disabled={isDisabled}
              >
                <ProviderInfo>
                  <ProviderNameRow>
                    <ProviderName>{provider.name}</ProviderName>
                    {highlight && !isDisabled ? <ProviderBadge>{highlight}</ProviderBadge> : null}
                  </ProviderNameRow>
                  <ProviderMeta>{metaText}</ProviderMeta>
                </ProviderInfo>
                <ProviderRight>
                  <ProviderQuote>{fiatDisplay}</ProviderQuote>
                  <ProviderFiat>{netDisplay}</ProviderFiat>
                </ProviderRight>
              </ProviderButton>
            )
          })}
        </ProviderList>

        <ContinueButtonWrapper>
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
          <Button variant="primary" onClick={handleContinue} disabled={step2Disabled}>
            Continue
          </Button>
        </ContinueButtonWrapper>
      </ModalContent>
    </PageContent>
  )
}

export default BuySelectProvider
