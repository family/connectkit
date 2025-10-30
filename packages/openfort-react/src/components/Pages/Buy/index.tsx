import { useEffect, useMemo, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { TickIcon } from '../../../assets/icons'
import Logos from '../../../assets/logos'
import useLocales from '../../../hooks/useLocales'
import { useTokens } from '../../../hooks/useTokens'
import Button from '../../Common/Button'
import { Arrow, ArrowChevron } from '../../Common/Button/styles'
import { ModalBody, ModalContent, ModalH1, PageContents } from '../../Common/Modal/styles'
import SquircleSpinner from '../../Common/SquircleSpinner'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { isSameToken, sanitiseForParsing, sanitizeAmountInput } from '../Send/utils'
import type { CoinbaseOnrampResponse } from './coinbaseApi'
import { createCoinbaseSession } from './coinbaseApi'
import { getProviderById, getProviderQuotes, getProviders } from './providers'
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
          if (popupUrl.includes('coinbase_onramp=success')) {
            popupWindow.close()
            setPopupWindow(null)
            setCurrentStep(4)
            clearInterval(checkPopup)
          }
        } catch (_e) {
          // Cross-origin error is expected while on Coinbase domain
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

  // Fetch Coinbase session when amount changes
  // Using one-click onramp URL (without location params) to let Coinbase handle geo-detection
  useEffect(() => {
    const fetchSession = async () => {
      if (!address || !fiatAmount || fiatAmount <= 0) {
        setCoinbaseSession(null)
        setQuoteError(null)
        return
      }

      setIsLoadingQuote(true)
      setQuoteError(null)
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
        setQuoteError(null)
      } catch (error) {
        setCoinbaseSession(null)
        setQuoteError(error instanceof Error ? error.message : 'Failed to create session')
      } finally {
        setIsLoadingQuote(false)
      }
    }

    // Debounce the session creation
    const timeoutId = setTimeout(fetchSession, 500)
    return () => clearTimeout(timeoutId)
  }, [fiatAmount, selectedToken.symbol, selectedToken.type, buyForm.currency, chainId, address])

  const providerQuotes = useMemo(() => getProviderQuotes(fiatAmount), [fiatAmount])
  const selectedProvider = getProviderById(buyForm.providerId)
  const selectedQuote = providerQuotes.find((quote) => quote.provider.id === selectedProvider.id) ?? {
    provider: selectedProvider,
    netAmount: null,
    feeAmount: null,
  }

  // Use real Coinbase quote if available (only present when country/subdivision/paymentMethod are provided)
  const realNetAmount = coinbaseSession?.quote?.purchaseAmount
    ? Number.parseFloat(coinbaseSession.quote.purchaseAmount)
    : null
  const displayNetAmount = realNetAmount ?? selectedQuote.netAmount

  const providerUrl = coinbaseSession?.session?.onrampUrl

  const _formattedNetAmount =
    displayNetAmount !== null ? `${displayNetAmount.toFixed(2)} ${tokenSymbol}` : isLoadingQuote ? '...' : '--'

  // Calculate total fees from Coinbase quote (only available if quote is returned)
  const totalFees = coinbaseSession?.quote?.fees?.reduce((sum, fee) => sum + Number.parseFloat(fee.amount), 0) ?? null
  const _formattedFees = totalFees !== null ? currencyFormatter.format(totalFees) : null

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

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)
    }
  }

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
      <PageContents>
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
      </PageContents>
    )
  }

  // Step 2: Provider Selection
  if (currentStep === 2) {
    const providers = getProviders()

    return (
      <PageContents>
        <ModalContent style={{ paddingBottom: 18, textAlign: 'left' }}>
          <ModalH1>Select Provider</ModalH1>
          <ModalBody style={{ marginTop: 8 }}>{formattedFiat && `Buying ${formattedFiat} of ${tokenSymbol}`}</ModalBody>

          <ProviderList>
            {providers.map((provider) => {
              const quote = providerQuotes.find((item) => item.provider.id === provider.id)
              const netDisplay =
                quote && quote.netAmount !== null ? `${quote.netAmount.toFixed(2)} ${tokenSymbol}` : '--'
              const fiatDisplay = fiatAmount !== null ? currencyFormatter.format(fiatAmount) : '--'
              const feePercentage = (provider.feeBps / 100).toFixed(2)
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
      </PageContents>
    )
  }

  // Step 3: Pending Screen
  if (currentStep === 3) {
    return (
      <PageContents>
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
      </PageContents>
    )
  }

  // Step 4: Provider Finished
  const blockExplorerUrl = address ? getBlockExplorerUrl(chainId, address) : ''

  return (
    <PageContents>
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
                View Wallet on Block Explorer
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
    </PageContents>
  )
}

export default Buy
