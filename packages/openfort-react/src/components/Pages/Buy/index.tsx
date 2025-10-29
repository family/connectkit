import { useEffect, useMemo, useState } from 'react'
import useLocales from '../../../hooks/useLocales'
import { useTokens } from '../../../hooks/useTokens'
import Button from '../../Common/Button'
import { Arrow, ArrowChevron } from '../../Common/Button/styles'
import { ModalBody, ModalContent, ModalH1, PageContent } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { isSameToken, sanitiseForParsing, sanitizeAmountInput } from '../Send/utils'
import { getProviderById, getProviderQuotes } from './providers'
import {
  AmountCard,
  AmountInput,
  ContinueButtonWrapper,
  CurrencySymbol,
  PresetButton,
  PresetList,
  Section,
  SectionLabel,
  SelectorButton,
  SelectorContent,
  SelectorRight,
  SelectorSubtitle,
  SelectorTitle,
  SelectorValue,
} from './styles'
import { createCurrencyFormatter, getCurrencySymbol } from './utils'

const amountPresets = [100, 250, 500]

const Buy = () => {
  const { buyForm, setBuyForm, setRoute, uiConfig } = useOpenfort()
  const locales = useLocales()
  const { nativeOption, tokenOptions } = useTokens()
  const [pressedPreset, setPressedPreset] = useState<number | null>(null)

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

  const providerQuotes = useMemo(() => getProviderQuotes(fiatAmount), [fiatAmount])
  const selectedProvider = getProviderById(buyForm.providerId)
  const selectedQuote = providerQuotes.find((quote) => quote.provider.id === selectedProvider.id) ?? {
    provider: selectedProvider,
    netAmount: null,
    feeAmount: null,
  }

  const providerUrl =
    selectedProvider.url ?? uiConfig.buyWithCardUrl ?? uiConfig.buyFromExchangeUrl ?? uiConfig.buyTroubleshootingUrl

  const formattedNetAmount =
    selectedQuote && selectedQuote.netAmount !== null ? `${selectedQuote.netAmount.toFixed(2)} ${tokenSymbol}` : '--'

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

  const handleOpenProviderSelector = () => {
    setRoute(routes.BUY_PROVIDER_SELECT)
  }

  const handleContinue = () => {
    if (!providerUrl) return

    if (typeof window !== 'undefined') {
      window.open(providerUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const isPresetSelected = (value: number) => pressedPreset === value

  const formattedFiat = fiatAmount !== null ? currencyFormatter.format(fiatAmount) : null
  const continueDisabled = fiatAmount === null || fiatAmount <= 0 || selectedQuote.netAmount === null || !providerUrl

  return (
    <PageContent>
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

        <Section>
          <SectionLabel>Provider</SectionLabel>
          <SelectorButton type="button" onClick={handleOpenProviderSelector}>
            <SelectorContent>
              <SelectorTitle>{selectedProvider.name}</SelectorTitle>
              <SelectorSubtitle>
                {formattedFiat ? `You pay ${formattedFiat}` : 'Choose a provider to compare quotes'}
              </SelectorSubtitle>
            </SelectorContent>
            <SelectorRight>
              <SelectorValue>{formattedNetAmount}</SelectorValue>
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
          <Button variant="primary" onClick={handleContinue} disabled={continueDisabled}>
            Continue
          </Button>
        </ContinueButtonWrapper>
      </ModalContent>
    </PageContent>
  )
}

export default Buy
