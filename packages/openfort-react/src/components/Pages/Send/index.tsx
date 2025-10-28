import { useEffect, useMemo } from 'react'
import { formatUnits, isAddress, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useTokenCache } from '../../../hooks/useTokenCache'
import { useTokens } from '../../../hooks/useTokens'
import Button from '../../Common/Button'
import Input from '../../Common/Input'
import { ModalBody, ModalH1, PageContent } from '../../Common/Modal/styles'
import { routes, type SendFormState, type SendTokenOption } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import {
  AmountInputWrapper,
  ErrorText,
  Field,
  FieldLabel,
  Form,
  HelperText,
  MaxButton,
  TokenSelectorButton,
  TokenSelectorChevron,
  TokenSelectorContent,
  TokenSelectorRight,
  TokenSelectorValue,
} from './styles'
import { formatBalance, isSameToken, sanitiseForParsing, sanitizeAmountInput } from './utils'

const Send = () => {
  const { sendForm, setSendForm, setRoute } = useOpenfort()
  const { address, chain } = useAccount()
  const chainId = chain?.id

  const { nativeOption, tokenOptions } = useTokens()
  const { cachedSelectedToken, cacheSelectedToken } = useTokenCache(address, chainId)

  // Load cached token on mount if sendForm token is default/empty
  useEffect(() => {
    if (cachedSelectedToken && !sendForm.token.symbol) {
      setSendForm((prev) => ({
        ...prev,
        token: cachedSelectedToken,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  useEffect(() => {
    setSendForm((prev) => {
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
  }, [nativeOption.decimals, nativeOption.symbol, setSendForm])

  const matchedToken = useMemo(
    () => tokenOptions.find((token) => isSameToken(token, sendForm.token)),
    [tokenOptions, sendForm.token]
  )

  const selectedTokenOption = matchedToken ?? tokenOptions[0]
  const selectedToken: SendTokenOption = selectedTokenOption ?? sendForm.token
  const selectedBalanceValue = selectedTokenOption?.balanceValue

  // Cache selected token when it changes
  useEffect(() => {
    if (selectedToken.symbol) {
      cacheSelectedToken(selectedToken)
    }
  }, [selectedToken, cacheSelectedToken])

  const parsedAmount = useMemo(() => {
    const rawAmount = sanitiseForParsing(sendForm.amount)
    if (!rawAmount) return null
    try {
      return parseUnits(rawAmount, selectedToken.decimals)
    } catch (_error) {
      return null
    }
  }, [sendForm.amount, selectedToken.decimals])

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
    const maxAmount = formatUnits(selectedBalanceValue, selectedToken.decimals)
    setSendForm((prev) => ({
      ...prev,
      amount: maxAmount,
    }))
  }

  const handleOpenTokenSelector = () => {
    setRoute(routes.SEND_TOKEN_SELECT)
  }

  const availableLabel = formatBalance(selectedBalanceValue, selectedToken.decimals)
  const maxDisabled = !selectedBalanceValue

  return (
    <PageContent>
      <ModalH1>Send tokens</ModalH1>
      <ModalBody style={{ marginTop: 8 }}>Choose a recipient, token, and amount to send.</ModalBody>
      <Form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel>Recipient address</FieldLabel>
          <Input
            placeholder="0x..."
            value={sendForm.recipient}
            onChange={handleRecipientChange}
            autoComplete="off"
            style={{ marginTop: 8 }}
          />
          {sendForm.recipient && !recipientValid && <ErrorText>Enter a valid wallet address.</ErrorText>}
        </Field>

        <Field>
          <FieldLabel>Token</FieldLabel>
          <TokenSelectorButton type="button" onClick={handleOpenTokenSelector}>
            <TokenSelectorContent>
              <TokenSelectorValue $primary>{selectedToken.symbol || 'Select token'}</TokenSelectorValue>
              {'name' in selectedToken && selectedToken.name ? (
                <TokenSelectorValue $muted>{selectedToken.name}</TokenSelectorValue>
              ) : null}
            </TokenSelectorContent>
            <TokenSelectorRight>
              <TokenSelectorValue>
                {availableLabel === '--' ? '--' : `${availableLabel} ${selectedToken.symbol}`}
              </TokenSelectorValue>
              <TokenSelectorChevron aria-hidden>{'▶'}</TokenSelectorChevron>
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
            Available: {availableLabel} {selectedToken.symbol}
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
