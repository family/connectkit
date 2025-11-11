import { useEffect, useMemo, useRef } from 'react'
import { formatUnits, isAddress, parseUnits } from 'viem'
import { useWalletAssets } from '../../../hooks/openfort/useWalletAssets'
import Button from '../../Common/Button'
import { Arrow, ArrowChevron } from '../../Common/Button/styles'
import Input from '../../Common/Input'
import { ModalBody, ModalHeading } from '../../Common/Modal/styles'
import { type Asset, routes, type SendFormState } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import {
  AmountInputWrapper,
  ErrorText,
  Field,
  FieldLabel,
  Form,
  HelperText,
  MaxButton,
  TokenSelectorButton,
  TokenSelectorContent,
  TokenSelectorRight,
  TokenSelectorValue,
} from './styles'
import { formatBalance, isSameToken, sanitiseForParsing, sanitizeAmountInput } from './utils'

const Send = () => {
  const { sendForm, setSendForm, setRoute } = useOpenfort()

  // const { nativeOption, tokenOptions } = useTokens()
  const { data: assets, refetch } = useWalletAssets()

  // Track if we're navigating to confirmation to avoid resetting amount
  const isNavigatingToConfirmationRef = useRef(false)

  // Reset the ref when component mounts
  useEffect(() => {
    refetch()
    isNavigatingToConfirmationRef.current = false
  }, [])

  // Reset amount when component unmounts (navigating away or closing modal)
  // but NOT when going to SendConfirmation
  useEffect(() => {
    return () => {
      if (!isNavigatingToConfirmationRef.current) {
        setSendForm((prev) => ({
          ...prev,
          amount: '',
        }))
      }
    }
  }, [setSendForm])

  // useEffect(() => {
  //   setSendForm((prev) => {
  //     if (prev.token.type !== 'native') return prev
  //     const nextSymbol = nativeOption.symbol || prev.token.symbol || 'ETH'
  //     const nextDecimals = nativeOption.decimals ?? prev.token.decimals ?? 18
  //     if (prev.token.symbol === nextSymbol && prev.token.decimals === nextDecimals) return prev
  //     return {
  //       ...prev,
  //       token: {
  //         type: 'native',
  //         symbol: nextSymbol,
  //         decimals: nextDecimals,
  //       },
  //     }
  //   })
  // }, [nativeOption.decimals, nativeOption.symbol, setSendForm])

  const matchedToken = useMemo(
    () => assets?.find((asset) => isSameToken(asset, sendForm.asset)),
    [assets, sendForm.asset]
  )

  const selectedTokenOption = matchedToken ?? assets?.[0]
  const selectedToken: Asset = selectedTokenOption ?? sendForm.asset
  const selectedBalanceValue = selectedTokenOption?.balance
  const selectedDecimalsValue = selectedToken.type === 'erc20' ? (selectedToken.metadata?.decimals ?? 18) : 18
  const selectedSymbol = (selectedToken.metadata?.symbol as string) ?? ''

  const parsedAmount = useMemo(() => {
    const rawAmount = sanitiseForParsing(sendForm.amount)
    if (!rawAmount) return null
    try {
      return parseUnits(rawAmount, selectedDecimalsValue)
    } catch (_error) {
      return null
    }
  }, [sendForm.amount, selectedDecimalsValue])

  const recipientValid = isAddress(sendForm.recipient)
  const insufficientBalance =
    parsedAmount !== null && selectedBalanceValue !== undefined ? parsedAmount > selectedBalanceValue : false
  const hasAmount = parsedAmount !== null && parsedAmount > BigInt(0)
  const amountValid = hasAmount && !insufficientBalance

  const canProceed = recipientValid && amountValid

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canProceed) return
    const normalised = sanitiseForParsing(sendForm.amount)
    if (!normalised) return
    setSendForm((prev: SendFormState) => ({
      ...prev,
      amount: normalised,
      token: selectedToken,
    }))
    // Mark that we're navigating to confirmation so amount isn't reset
    isNavigatingToConfirmationRef.current = true
    setRoute(routes.SEND_CONFIRMATION)
  }

  const handleRecipientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendForm((prev) => ({
      ...prev,
      recipient: event.target.value,
    }))
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = sanitizeAmountInput(event.target.value)
    if (raw === '' || /^[0-9]*\.?[0-9]*$/.test(raw)) {
      setSendForm((prev) => ({
        ...prev,
        amount: raw,
      }))
    }
  }

  const handleMax = () => {
    if (!selectedBalanceValue) return
    const maxAmount = formatUnits(selectedBalanceValue, selectedDecimalsValue)
    setSendForm((prev) => ({
      ...prev,
      amount: maxAmount,
    }))
  }

  const handleOpenTokenSelector = () => {
    setRoute(routes.SEND_TOKEN_SELECT)
  }

  const availableLabel = formatBalance(selectedBalanceValue, selectedDecimalsValue)
  const maxDisabled = !selectedBalanceValue

  return (
    <PageContent onBack={'profile'}>
      <ModalHeading>Send tokens</ModalHeading>
      <ModalBody>Choose a recipient, token, and amount to send.</ModalBody>
      <Form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel>Recipient address</FieldLabel>
          <Input placeholder="0x..." value={sendForm.recipient} onChange={handleRecipientChange} autoComplete="off" />
          {sendForm.recipient && !recipientValid && <ErrorText>Enter a valid wallet address.</ErrorText>}
        </Field>

        <Field>
          <FieldLabel>Token</FieldLabel>
          <TokenSelectorButton type="button" onClick={handleOpenTokenSelector}>
            <TokenSelectorContent>
              <TokenSelectorValue $primary>{selectedSymbol || 'Select token'}</TokenSelectorValue>
            </TokenSelectorContent>
            <TokenSelectorRight>
              <TokenSelectorValue>
                {availableLabel === '--' ? '--' : `${availableLabel} ${selectedSymbol ?? ''}`}
              </TokenSelectorValue>
              <Arrow width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ArrowChevron
                  stroke="currentColor"
                  d="M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Arrow>
            </TokenSelectorRight>
          </TokenSelectorButton>
        </Field>

        <Field>
          <FieldLabel>Amount</FieldLabel>
          <AmountInputWrapper>
            <Input
              placeholder="0.00"
              value={sendForm.amount}
              onChange={handleAmountChange}
              inputMode="decimal"
              autoComplete="off"
              style={{ paddingRight: '86px' }}
            />
            <MaxButton type="button" onClick={handleMax} disabled={maxDisabled}>
              Max
            </MaxButton>
          </AmountInputWrapper>
          <HelperText>
            Available: {availableLabel} {selectedSymbol}
          </HelperText>
          {sendForm.amount && parsedAmount === null && <ErrorText>Enter a valid amount.</ErrorText>}
          {insufficientBalance && <ErrorText>Insufficient balance for this transfer.</ErrorText>}
        </Field>

        <Button variant="primary" disabled={!canProceed}>
          Review transfer
        </Button>
      </Form>
    </PageContent>
  )
}

export default Send
