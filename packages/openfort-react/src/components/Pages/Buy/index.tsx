import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { ExternalLinkIcon, TickIcon } from '../../../assets/icons'
import Logos from '../../../assets/logos'
import useLocales from '../../../hooks/useLocales'
import { useTokens } from '../../../hooks/useTokens'
import Button from '../../Common/Button'
import { Arrow, ArrowChevron } from '../../Common/Button/styles'
import { ModalBody, ModalContent, ModalH1 } from '../../Common/Modal/styles'
import SquircleSpinner from '../../Common/SquircleSpinner'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { isSameToken, sanitiseForParsing, sanitizeAmountInput } from '../Send/utils'
import type { CoinbaseOnrampResponse, CoinbaseOrderQuote } from './coinbaseApi'
import { createCoinbaseSession, getOrderQuote } from './coinbaseApi'
import { getProviders } from './providers'
import type { StripeOnrampResponse, StripeQuote } from './stripeApi'
import { createStripeSession, getStripeQuote } from './stripeApi'
import {
  AmountCard,
  AmountInput,
  ContinueButtonWrapper,
  CurrencySymbol,
  PendingContainer,
  PresetButton,
  PresetList,
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
  Section,
  SectionLabel,
  SelectorButton,
  SelectorContent,
  SelectorRight,
  SelectorSubtitle,
  SelectorTitle,
  SuccessIconContainer,
} from './styles'
import { createCurrencyFormatter, getCurrencySymbol } from './utils'

const amountPresets = [10, 20, 50]

const Buy = () => {
  const { buyForm, setBuyForm, setRoute, triggerResize } = useOpenfort()
  const locales = useLocales()
  const { nativeOption, tokenOptions } = useTokens()
  const { address } = useAccount()
  const chainId = useChainId()
  const [pressedPreset, setPressedPreset] = useState<number | null>(null)
  const [coinbaseSession, setCoinbaseSession] = useState<CoinbaseOnrampResponse | null>(null)
  const [stripeSession, setStripeSession] = useState<StripeOnrampResponse | null>(null)
  const [orderQuote, setOrderQuote] = useState<CoinbaseOrderQuote | null>(null)
  const [stripeQuote, setStripeQuote] = useState<StripeQuote | null>(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [_quoteError, setQuoteError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [popupWindow, setPopupWindow] = useState<Window | null>(null)

  // Trigger resize when step changes
  useEffect(() => {
    triggerResize()
  }, [currentStep, triggerResize])

  // Monitor popup window for Coinbase redirect
  useEffect(() => {
    if (!popupWindow) return

    const checkPopup = setInterval(() => {
      try {
        // Check if popup is closed
        if (popupWindow.closed) {
          clearInterval(checkPopup)
          setPopupWindow(null)
          // Go to completion step when popup closes
          setCurrentStep(4)
          return
        }

        // Try to check if popup has redirected to our success URL
        try {
          const popupUrl = popupWindow.location.href
          if (popupUrl.includes('coinbase_onramp=success') || popupUrl.includes('stripe_onramp=success')) {
            popupWindow.close()
            setPopupWindow(null)
            setCurrentStep(4)
            clearInterval(checkPopup)
          }
        } catch (_e) {
          // Cross-origin error is expected while on provider domain
          // We can't read the URL until it redirects back to our domain
        }
      } catch (_error) {
        // Handle any other errors
        clearInterval(checkPopup)
      }
    }, 500)

    return () => {
      clearInterval(checkPopup)
    }
  }, [popupWindow])

  useEffect(() => {
    setBuyForm((prev) => {
      if (prev.token.type !== 'native') return prev
      const nextSymbol = nativeOption.symbol || prev.token.symbol || 'ETH'
      const nextDecimals = nativeOption.decimals ?? prev.token.decimals ?? 18
      if (prev.token.symbol === nextSymbol && prev.token.decimals === nextDecimals) return prev
      return {
        ...prev,
        token: {
          type: 'native',
          symbol: nextSymbol,
          decimals: nextDecimals,
        },
      }
    })
  }, [nativeOption.decimals, nativeOption.symbol, setBuyForm])

  const matchedToken = useMemo(
    () => tokenOptions.find((token) => isSameToken(token, buyForm.token)),
    [tokenOptions, buyForm.token]
  )

  const selectedTokenOption = matchedToken ?? tokenOptions[0]
  const selectedToken = selectedTokenOption ?? buyForm.token

  const tokenSymbol = selectedToken.symbol || 'Token'
  const tokenName = 'name' in selectedToken && selectedToken.name ? selectedToken.name : tokenSymbol

  const fiatAmount = useMemo(() => {
    const normalizedAmount = sanitiseForParsing(sanitizeAmountInput(buyForm.amount))
    if (!normalizedAmount) return null
    const numeric = Number(normalizedAmount)
    if (!Number.isFinite(numeric)) return null
    return numeric
  }, [buyForm.amount])

  const currencyFormatter = useMemo(() => createCurrencyFormatter(buyForm.currency), [buyForm.currency])
  const currencySymbol = useMemo(() => getCurrencySymbol(buyForm.currency), [buyForm.currency])

  // Fetch real quote from orders endpoint
  useEffect(() => {
    const fetchQuote = async () => {
      if (!address || !fiatAmount || fiatAmount <= 0) {
        setOrderQuote(null)
        setQuoteError(null)
        return
      }

      setIsLoadingQuote(true)
      setQuoteError(null)
      try {
        const quote = await getOrderQuote({
          token: selectedToken,
          chainId,
          destinationAddress: address,
          purchaseAmount: fiatAmount.toFixed(2),
          paymentCurrency: buyForm.currency,
          paymentMethod: 'GUEST_CHECKOUT_APPLE_PAY',
        })
        setOrderQuote(quote)
        setQuoteError(null)
      } catch (error) {
        setOrderQuote(null)
        setQuoteError(error instanceof Error ? error.message : 'Failed to fetch quote')
      } finally {
        setIsLoadingQuote(false)
      }
    }

    // Debounce the quote fetching
    const timeoutId = setTimeout(fetchQuote, 500)
    return () => clearTimeout(timeoutId)
  }, [fiatAmount, selectedToken.symbol, selectedToken.type, buyForm.currency, chainId, address])

  // Fetch Coinbase session when amount changes
  // Using one-click onramp URL (without location params) to let Coinbase handle geo-detection
  useEffect(() => {
    const fetchSession = async () => {
      if (!address || !fiatAmount || fiatAmount <= 0) {
        setCoinbaseSession(null)
        return
      }

      try {
        const session = await createCoinbaseSession({
          token: selectedToken,
          chainId,
          destinationAddress: address,
          paymentAmount: fiatAmount.toFixed(2),
          paymentCurrency: buyForm.currency,
          redirectUrl: `${window.location.origin}?coinbase_onramp=success`,
          // Note: Not including paymentMethod, country, subdivision
          // This creates a one-click onramp URL without a quote
          // Coinbase will handle location detection and payment methods
        })
        setCoinbaseSession(session)
      } catch (_error) {
        setCoinbaseSession(null)
      }
    }

    // Debounce the session creation
    const timeoutId = setTimeout(fetchSession, 500)
    return () => clearTimeout(timeoutId)
  }, [fiatAmount, selectedToken.symbol, selectedToken.type, buyForm.currency, chainId, address])

  // Fetch Stripe session when amount changes
  useEffect(() => {
    const fetchSession = async () => {
      if (!address || !fiatAmount || fiatAmount <= 0) {
        setStripeSession(null)
        return
      }

      try {
        const session = await createStripeSession({
          token: selectedToken,
          chainId,
          destinationAddress: address,
          sourceAmount: fiatAmount.toFixed(2),
          sourceCurrency: buyForm.currency,
          redirectUrl: `${window.location.origin}?stripe_onramp=success`,
        })
        setStripeSession(session)
      } catch (_error) {
        setStripeSession(null)
      }
    }

    // Debounce the session creation
    const timeoutId = setTimeout(fetchSession, 500)
    return () => clearTimeout(timeoutId)
  }, [fiatAmount, selectedToken.symbol, selectedToken.type, buyForm.currency, chainId, address])

  // Fetch Stripe quote when amount changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!address || !fiatAmount || fiatAmount <= 0) {
        setStripeQuote(null)
        return
      }

      try {
        const quote = await getStripeQuote({
          token: selectedToken,
          chainId,
          sourceCurrency: buyForm.currency,
          sourceAmount: fiatAmount.toFixed(2),
        })
        setStripeQuote(quote)
      } catch (_error) {
        setStripeQuote(null)
      }
    }

    // Debounce the quote fetching
    const timeoutId = setTimeout(fetchQuote, 500)
    return () => clearTimeout(timeoutId)
  }, [fiatAmount, selectedToken.symbol, selectedToken.type, buyForm.currency, chainId, address])

  // Use real quote from orders endpoint
  const realPurchaseAmount = orderQuote?.order?.purchaseAmount
    ? Number.parseFloat(orderQuote.order.purchaseAmount)
    : null
  const realTotalFees = orderQuote?.order?.fees?.reduce((sum, fee) => sum + Number.parseFloat(fee.amount), 0) ?? null

  // Calculate real fee percentage
  const realFeePercentage =
    fiatAmount && realTotalFees !== null ? ((realTotalFees / fiatAmount) * 100).toFixed(2) : null

  const displayNetAmount = realPurchaseAmount

  // Get the provider URL based on selected provider
  const providerUrl =
    buyForm.providerId === 'stripe' ? stripeSession?.session?.onrampUrl : coinbaseSession?.session?.onrampUrl

  const _formattedNetAmount =
    displayNetAmount !== null ? `${displayNetAmount.toFixed(2)} ${tokenSymbol}` : isLoadingQuote ? '...' : '--'
  const _formattedFees = realTotalFees !== null ? currencyFormatter.format(realTotalFees) : null

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = sanitizeAmountInput(event.target.value)
    if (raw === '' || /^[0-9]*\.?[0-9]*$/.test(raw)) {
      setPressedPreset(null)
      setBuyForm((prev) => ({
        ...prev,
        amount: raw,
      }))
    }
  }

  const handleAmountBlur = () => {
    const normalized = sanitiseForParsing(sanitizeAmountInput(buyForm.amount))
    if (normalized) {
      const numeric = Number(normalized)
      if (Number.isFinite(numeric) && numeric > 0) {
        setBuyForm((prev) => ({
          ...prev,
          amount: numeric.toFixed(2),
        }))
      }
    }
  }

  const handlePresetClick = (value: number) => {
    setPressedPreset(value)
    setBuyForm((prev) => ({
      ...prev,
      amount: value.toFixed(2),
    }))
  }

  const handleOpenTokenSelector = () => {
    setRoute(routes.BUY_TOKEN_SELECT)
  }

  const _handleOpenProviderSelector = () => {
    setRoute(routes.BUY_PROVIDER_SELECT)
  }

  const handleSelectProvider = (id: string) => {
    setBuyForm((prev) => ({
      ...prev,
      providerId: id as typeof prev.providerId,
    }))
  }

  const handleContinueFromStep1 = () => {
    if (fiatAmount === null || fiatAmount <= 0) return
    setCurrentStep(2)
  }

  const handleContinueFromStep2 = () => {
    if (!providerUrl) return
    setCurrentStep(3)

    // TODO: remove this? it fails if is set to EUR in coinbase
    const url = new URL(providerUrl)
    url.searchParams.delete('fiatCurrency')
    const sanitizedProviderUrl = url.toString()

    if (typeof window !== 'undefined') {
      const popupWidth = 500
      const popupHeight = 700
      const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX
      const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY
      const width = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
          ? document.documentElement.clientWidth
          : screen.width
      const height = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
          ? document.documentElement.clientHeight
          : screen.height
      const left = width / 2 - popupWidth / 2 + dualScreenLeft
      const top = height / 2 - popupHeight / 2 + dualScreenTop

      const popup = window.open(
        sanitizedProviderUrl,
        'BuyPopup',
        `scrollbars=yes,width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
      )

      if (popup) {
        setPopupWindow(popup)
      }
    }
  }

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : prev))
  }, [])

  const handleDone = () => {
    setCurrentStep(1)
    setRoute(routes.PROFILE)
  }

  const getBlockExplorerUrl = (chainId: number, address: string): string => {
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io',
      8453: 'https://basescan.org',
      137: 'https://polygonscan.com',
      42161: 'https://arbiscan.io',
      10: 'https://optimistic.etherscan.io',
      84532: 'https://sepolia.basescan.org',
    }
    const baseUrl = explorers[chainId] || 'https://basescan.org'
    return `${baseUrl}/address/${address}`
  }

  const isPresetSelected = (value: number) => pressedPreset === value

  const formattedFiat = fiatAmount !== null ? currencyFormatter.format(fiatAmount) : null
  const step1Disabled = fiatAmount === null || fiatAmount <= 0
  const step2Disabled = !address || !providerUrl || isLoadingQuote

  // Step 1: Amount and Token Selection
  if (currentStep === 1) {
    return (
      <PageContent onBack={handleBack}>
        <ModalContent style={{ paddingBottom: 18, textAlign: 'left' }}>
          <ModalH1>{locales.buyScreen_heading}</ModalH1>
          <ModalBody style={{ marginTop: 8 }}>{locales.buyScreen_subheading}</ModalBody>

          <Section>
            <SectionLabel>Amount</SectionLabel>
            <AmountCard>
              <CurrencySymbol>{currencySymbol}</CurrencySymbol>
              <AmountInput
                value={buyForm.amount}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
                placeholder="0.00"
                inputMode="decimal"
                autoComplete="off"
              />
            </AmountCard>
            <PresetList>
              {amountPresets.map((preset) => (
                <PresetButton
                  key={preset}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  $active={isPresetSelected(preset)}
                >
                  {currencyFormatter.format(preset)}
                </PresetButton>
              ))}
            </PresetList>
          </Section>

          <Section>
            <SectionLabel>Token</SectionLabel>
            <SelectorButton type="button" onClick={handleOpenTokenSelector}>
              <SelectorContent>
                <SelectorTitle>{tokenSymbol || 'Select token'}</SelectorTitle>
                <SelectorSubtitle>{tokenName}</SelectorSubtitle>
              </SelectorContent>
              <SelectorRight>
                <Arrow width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ArrowChevron
                    stroke="currentColor"
                    d="M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </Arrow>
              </SelectorRight>
            </SelectorButton>
          </Section>

          <ContinueButtonWrapper>
            <Button variant="primary" onClick={handleContinueFromStep1} disabled={step1Disabled}>
              Continue
            </Button>
          </ContinueButtonWrapper>
        </ModalContent>
      </PageContent>
    )
  }

  // Step 2: Provider Selection
  if (currentStep === 2) {
    const providers = getProviders()

    return (
      <PageContent onBack={handleBack}>
        <ModalContent style={{ paddingBottom: 18, textAlign: 'left' }}>
          <ModalH1>Select Provider</ModalH1>
          <ModalBody style={{ marginTop: 8 }}>{formattedFiat && `Buying ${formattedFiat} of ${tokenSymbol}`}</ModalBody>

          <ProviderList>
            {providers.map((provider) => {
              // Get provider-specific quote data
              let providerNetAmount: number | null = null
              let providerFeePercentage: string | null = null
              let providerFiatAmount: number | null = fiatAmount

              if (provider.id === 'coinbase') {
                // Show the requested amount (what user wants to receive)
                providerNetAmount = fiatAmount
                providerFeePercentage = realFeePercentage
                // Use paymentTotal to show the actual total the user will pay including fees
                if (orderQuote?.order?.paymentTotal) {
                  providerFiatAmount = Number.parseFloat(orderQuote.order.paymentTotal)
                }
              } else if (provider.id === 'stripe' && stripeQuote) {
                providerNetAmount = Number.parseFloat(stripeQuote.destination_amount)
                // Use source_total_amount to show the actual total the user will pay
                providerFiatAmount = Number.parseFloat(stripeQuote.source_total_amount)
                // Calculate total fees from Stripe quote
                const networkFee = Number.parseFloat(stripeQuote.fees.network_fee_monetary)
                const transactionFee = Number.parseFloat(stripeQuote.fees.transaction_fee_monetary)
                const stripeFees = networkFee + transactionFee
                providerFeePercentage = fiatAmount ? ((stripeFees / fiatAmount) * 100).toFixed(2) : null
              }

              // Use real quote data if available, otherwise show loading or fallback
              const netDisplay = isLoadingQuote
                ? '...'
                : providerNetAmount !== null
                  ? providerNetAmount > 0 && providerNetAmount < 0.01
                    ? `<0.01 ${tokenSymbol}`
                    : `${providerNetAmount.toFixed(2)} ${tokenSymbol}`
                  : '--'
              const fiatDisplay = providerFiatAmount !== null ? currencyFormatter.format(providerFiatAmount) : '--'

              // Use real fee percentage if available
              const feePercentage = providerFeePercentage ?? (provider.feeBps / 100).toFixed(2)
              const highlight =
                provider.highlight === 'best' ? 'Best price' : provider.highlight === 'fast' ? 'Fastest' : null

              const metaParts: string[] = []
              if (provider.tagline && provider.tagline !== highlight) {
                metaParts.push(provider.tagline)
              }
              metaParts.push(`Fee ${feePercentage}%`)
              const metaText = metaParts.join(' • ')

              const isActive = buyForm.providerId === provider.id

              return (
                <ProviderButton
                  key={provider.id}
                  type="button"
                  onClick={() => handleSelectProvider(provider.id)}
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

          <ContinueButtonWrapper>
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button variant="primary" onClick={handleContinueFromStep2} disabled={step2Disabled}>
              Continue
            </Button>
          </ContinueButtonWrapper>
        </ModalContent>
      </PageContent>
    )
  }

  // Step 3: Pending Screen
  if (currentStep === 3) {
    return (
      <PageContent onBack={handleBack}>
        <ModalContent style={{ paddingBottom: 18, textAlign: 'center' }}>
          <ModalH1>Processing Purchase</ModalH1>
          <ModalBody style={{ marginTop: 8 }}>Complete the purchase in the popup window...</ModalBody>

          <PendingContainer>
            <SquircleSpinner
              logo={
                <div
                  style={{
                    padding: '12px',
                    position: 'relative',
                    width: '100%',
                  }}
                >
                  <Logos.Openfort />
                </div>
              }
              connecting={true}
            />
          </PendingContainer>

          <ModalBody>Waiting for transaction confirmation</ModalBody>

          <ContinueButtonWrapper>
            <Button
              variant="secondary"
              onClick={() => {
                if (popupWindow && !popupWindow.closed) {
                  popupWindow.close()
                }
                setPopupWindow(null)
                setCurrentStep(1)
              }}
            >
              Close
            </Button>
          </ContinueButtonWrapper>
        </ModalContent>
      </PageContent>
    )
  }

  // Step 4: Provider Finished
  const blockExplorerUrl = address ? getBlockExplorerUrl(chainId, address) : ''

  return (
    <PageContent onBack={handleBack}>
      <ModalContent style={{ paddingBottom: 18, textAlign: 'center' }}>
        <ModalH1>Provider Finished</ModalH1>

        <SuccessIconContainer>
          <TickIcon />
        </SuccessIconContainer>

        <ModalBody>
          The provider flow has been completed. You can view your wallet on the block explorer to check your
          transactions.
        </ModalBody>

        <Section style={{ marginTop: 24 }}>
          {blockExplorerUrl && (
            <ContinueButtonWrapper style={{ marginTop: 0 }}>
              <Button
                variant="secondary"
                onClick={() => window.open(blockExplorerUrl, '_blank', 'noopener,noreferrer')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>View Wallet Transactions</span>
                  <ExternalLinkIcon />
                </div>
              </Button>
            </ContinueButtonWrapper>
          )}
          <ContinueButtonWrapper style={{ marginTop: blockExplorerUrl ? 4 : 0 }}>
            <Button variant="primary" onClick={handleDone}>
              Done
            </Button>
          </ContinueButtonWrapper>
        </Section>
      </ModalContent>
    </PageContent>
  )
}

export default Buy
