import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { ExternalLinkIcon } from '../../../assets/icons'
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
import { createCoinbaseSession, isCoinbaseSupported } from './coinbaseApi'
import type { OnrampQuote } from './onrampApi'
import { getAllQuotes } from './onrampApi'
import { getProviders } from './providers'
import { createStripeSession, isStripeSupported } from './stripeApi'
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
  StackedButtonWrapper,
} from './styles'
import { createCurrencyFormatter, getCurrencySymbol } from './utils'

const amountPresets = [10, 20, 50]

const Buy = () => {
  const { buyForm, setBuyForm, setRoute, triggerResize, publishableKey } = useOpenfort()
  const locales = useLocales()
  const { nativeOption, tokenOptions } = useTokens()
  const { address } = useAccount()
  const chainId = useChainId()
  const [pressedPreset, setPressedPreset] = useState<number | null>(null)
  const [quotes, setQuotes] = useState<Record<string, OnrampQuote>>({})
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [_quoteError, setQuoteError] = useState<string | null>(null)
  const [coinbaseError, setCoinbaseError] = useState<boolean>(false)
  const [stripeError, setStripeError] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [popupWindow, setPopupWindow] = useState<Window | null>(null)
  const [showContinueButton, setShowContinueButton] = useState(false)
  const [quoteRefreshTimer, setQuoteRefreshTimer] = useState(60)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const fiatAmount = useMemo(() => {
    const normalizedAmount = sanitiseForParsing(sanitizeAmountInput(buyForm.amount))
    if (!normalizedAmount) return null
    const numeric = Number(normalizedAmount)
    if (!Number.isFinite(numeric)) return null
    return numeric
  }, [buyForm.amount])

  // Trigger resize when step changes
  useEffect(() => {
    triggerResize()
  }, [currentStep, triggerResize])

  // Show continue button after 2 seconds when entering step 3
  useEffect(() => {
    if (currentStep === 3) {
      setShowContinueButton(false)
      const timer = setTimeout(() => {
        setShowContinueButton(true)
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      setShowContinueButton(false)
    }
  }, [currentStep])

  // Trigger resize when continue button appears
  useEffect(() => {
    if (showContinueButton) {
      triggerResize()
    }
  }, [showContinueButton, triggerResize])

  // Quote refresh timer - counts down from 60 and triggers refetch
  useEffect(() => {
    // Only run timer when on step 2 and we have a valid amount
    if (currentStep !== 2 || !fiatAmount || fiatAmount <= 0) {
      return
    }

    const interval = setInterval(() => {
      setQuoteRefreshTimer((prev) => {
        if (prev <= 1) {
          // Reset to 60 and trigger refetch
          setRefetchTrigger((t) => t + 1)
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentStep, fiatAmount])

  // Reset timer when moving to step 2 or when amount changes
  useEffect(() => {
    if (currentStep === 2 && fiatAmount && fiatAmount > 0) {
      setQuoteRefreshTimer(60)
    }
  }, [currentStep, fiatAmount])

  // Monitor popup window for Coinbase redirect
  useEffect(() => {
    if (!popupWindow) return

    const checkPopup = setInterval(() => {
      try {
        // Check if popup is closed
        if (popupWindow.closed) {
          clearInterval(checkPopup)
          setPopupWindow(null)
          // Only auto-advance for Coinbase
          if (buyForm.providerId === 'coinbase') {
            setCurrentStep(4)
          }
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
  }, [popupWindow, buyForm.providerId])

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

  const currencyFormatter = useMemo(() => createCurrencyFormatter(buyForm.currency), [buyForm.currency])
  const currencySymbol = useMemo(() => getCurrencySymbol(buyForm.currency), [buyForm.currency])

  // Fetch quotes from all providers
  useEffect(() => {
    const fetchQuotes = async () => {
      if (!address || !fiatAmount || fiatAmount <= 0) {
        setQuotes({})
        setQuoteError(null)
        setCoinbaseError(false)
        setStripeError(false)
        return
      }

      setIsLoadingQuote(true)
      setQuoteError(null)
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

        // Convert array to object keyed by provider
        const quotesMap: Record<string, OnrampQuote> = {}
        for (const quote of allQuotes) {
          quotesMap[quote.provider] = quote
        }
        setQuotes(quotesMap)
        setQuoteError(null)

        // Update error states based on which providers returned quotes
        setCoinbaseError(!quotesMap.coinbase && isCoinbaseSupported(selectedToken))
        setStripeError(!quotesMap.stripe && isStripeSupported(selectedToken))
      } catch (error) {
        setQuotes({})
        setQuoteError(error instanceof Error ? error.message : 'Failed to fetch quotes')
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

  const handleContinueFromStep2 = async () => {
    if (!address || !fiatAmount || fiatAmount <= 0) return

    setIsCreatingSession(true)

    try {
      let onrampUrl: string | null = null

      // Create session based on selected provider
      if (buyForm.providerId === 'coinbase') {
        const session = await createCoinbaseSession({
          token: selectedToken,
          chainId,
          publishableKey,
          destinationAddress: address,
          sourceAmount: fiatAmount.toFixed(2),
          sourceCurrency: buyForm.currency,
          redirectUrl: `${window.location.origin}?coinbase_onramp=success`,
        })
        onrampUrl = session.onrampUrl
      } else if (buyForm.providerId === 'stripe') {
        const session = await createStripeSession({
          token: selectedToken,
          chainId,
          publishableKey,
          destinationAddress: address,
          sourceAmount: fiatAmount.toFixed(2),
          sourceCurrency: buyForm.currency,
          redirectUrl: `${window.location.origin}?stripe_onramp=success`,
        })
        onrampUrl = session.onrampUrl
      }

      if (!onrampUrl) {
        setIsCreatingSession(false)
        return
      }

      setCurrentStep(3)

      // TODO: remove this? it fails if is set to EUR in coinbase
      const url = new URL(onrampUrl)
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
    } catch (_error) {
      // Update error state based on provider
      if (buyForm.providerId === 'coinbase') {
        setCoinbaseError(true)
      } else if (buyForm.providerId === 'stripe') {
        setStripeError(true)
      }
    } finally {
      setIsCreatingSession(false)
    }
  }

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : prev))
  }, [])

  const handleDone = useCallback(() => {
    setCurrentStep(1)
    setRoute(routes.PROFILE)
  }, [setCurrentStep, setRoute, routes.PROFILE])

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
  const step2Disabled = !address || isLoadingQuote || isCreatingSession

  // Step 1: Amount and Token Selection
  if (currentStep === 1) {
    return (
      <PageContent onBack={handleDone}>
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

              if (provider.id === 'coinbase') {
                // Check if token is supported
                if (!isCoinbaseSupported(selectedToken)) {
                  isDisabled = true
                  disabledReason = 'Token not supported'
                } else if (coinbaseError) {
                  isDisabled = true
                  disabledReason = 'Provider not supported'
                } else if (providerQuote) {
                  // Show the crypto amount the user will receive
                  providerNetAmount = Number.parseFloat(providerQuote.destinationAmount)
                  // Calculate total fees
                  const totalFees =
                    providerQuote.fees?.reduce((sum, fee) => sum + Number.parseFloat(fee.amount), 0) ?? 0
                  providerFeePercentage = fiatAmount ? ((totalFees / fiatAmount) * 100).toFixed(2) : null
                  // Show the total cost including fees (sourceAmount + fees)
                  const sourceAmount = Number.parseFloat(providerQuote.sourceAmount)
                  providerFiatAmount = sourceAmount + totalFees
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
                  providerNetAmount = Number.parseFloat(providerQuote.destinationAmount)
                  // Use sourceAmount to show the actual total the user will pay
                  providerFiatAmount = Number.parseFloat(providerQuote.sourceAmount)
                  // Calculate total fees
                  const totalFees =
                    providerQuote.fees?.reduce((sum, fee) => sum + Number.parseFloat(fee.amount), 0) ?? 0
                  providerFeePercentage = fiatAmount ? ((totalFees / fiatAmount) * 100).toFixed(2) : null
                }
              }

              // Use real quote data if available, otherwise show loading or fallback
              const netDisplay = isDisabled
                ? disabledReason
                : isLoadingQuote
                  ? '...'
                  : providerNetAmount !== null
                    ? providerNetAmount > 0 && providerNetAmount < 0.01
                      ? `<0.01 ${tokenSymbol}`
                      : `${providerNetAmount.toFixed(2)} ${tokenSymbol}`
                    : '--'
              const fiatDisplay = isDisabled
                ? ''
                : providerFiatAmount !== null
                  ? currencyFormatter.format(providerFiatAmount)
                  : '--'

              // Use real fee percentage if available
              const feePercentage = providerFeePercentage ?? (provider.feeBps / 100).toFixed(2)
              const highlight =
                provider.highlight === 'best' ? 'Best price' : provider.highlight === 'fast' ? 'Fastest' : null

              const metaText = isDisabled ? '' : `Fee ${feePercentage}%`

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
            <Button variant="secondary" onClick={handleBack} disabled={isCreatingSession}>
              Back
            </Button>
            <Button variant="primary" onClick={handleContinueFromStep2} disabled={step2Disabled}>
              {isCreatingSession ? 'Creating session...' : 'Continue'}
            </Button>
          </ContinueButtonWrapper>
        </ModalContent>
      </PageContent>
    )
  }

  // Step 3: Pending Screen
  if (currentStep === 3) {
    const isStripe = buyForm.providerId === 'stripe'

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

          {showContinueButton && (
            <ModalBody>
              {isStripe ? 'Click Continue when you are done.' : 'Waiting for transaction confirmation'}
            </ModalBody>
          )}

          {isStripe && showContinueButton ? (
            <>
              <StackedButtonWrapper>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (popupWindow && !popupWindow.closed) {
                      popupWindow.close()
                    }
                    setPopupWindow(null)
                    setCurrentStep(4)
                  }}
                >
                  Continue
                </Button>
              </StackedButtonWrapper>
              <StackedButtonWrapper>
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
                  Cancel
                </Button>
              </StackedButtonWrapper>
            </>
          ) : !isStripe && showContinueButton ? (
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
          ) : null}
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

        <ModalBody style={{ marginTop: 24 }}>
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
