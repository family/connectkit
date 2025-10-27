import { formatUnits, isAddress, parseUnits } from 'viem'
import { useAccount, useBalance, useReadContract } from 'wagmi'
import { useEffect, useMemo } from 'react'
import Button from '../../Common/Button'
import Input from '../../Common/Input'
import { ModalBody, ModalH1, PageContent } from '../../Common/Modal/styles'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { routes, type SendFormState, type SendTokenOption } from '../../Openfort/types'
import {
  AmountInputWrapper,
  ErrorText,
  Field,
  FieldLabel,
  Form,
  HelperText,
  MaxButton,
  TokenOptionButton,
  TokenOptions,
} from './styles'
import { ERC20_TOKEN_LIST } from './tokenList'
import { erc20Abi } from './erc20'
import { formatBalance, isSameToken, sanitizeAmountInput, sanitiseForParsing } from './utils'

const Send = () => {
  const { address, chain } = useAccount()
  const { data: nativeBalance } = useBalance({
    address,
    query: {
      enabled: !!address,
    },
  })

  const { sendForm, setSendForm, setRoute } = useOpenfort()

  const nativeSymbol = nativeBalance?.symbol
  const nativeDecimals = nativeBalance?.decimals
  const nativeValue = nativeBalance?.value

  const chainId = chain?.id

  const erc20Tokens = useMemo(() => {
    if (!chainId) return []
    return ERC20_TOKEN_LIST[chainId] ?? []
  }, [chainId])

  useEffect(() => {
    if (nativeSymbol === undefined && nativeDecimals === undefined) return
    setSendForm((prev) => {
      if (prev.token.type !== 'native') return prev
      const nextSymbol = nativeSymbol || prev.token.symbol || 'ETH'
      const nextDecimals = nativeDecimals ?? prev.token.decimals ?? 18
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
  }, [nativeSymbol, nativeDecimals, setSendForm])

  const tokenOptions: SendTokenOption[] = useMemo(() => {
    const nativeOption: SendTokenOption = {
      type: 'native',
      symbol: nativeSymbol || sendForm.token.symbol || 'ETH',
      decimals: nativeDecimals ?? sendForm.token.decimals ?? 18,
    }
    const erc20Options: SendTokenOption[] = erc20Tokens.map((token) => ({
      type: 'erc20',
      symbol: token.symbol,
      decimals: token.decimals,
      address: token.address,
      name: token.name,
    }))
    return [nativeOption, ...erc20Options]
  }, [erc20Tokens, nativeSymbol, nativeDecimals, sendForm.token.decimals, sendForm.token.symbol])

  const selectedToken: SendTokenOption = useMemo(() => {
    if (sendForm.token.type === 'erc20') {
      const sendTokenAddress = sendForm.token.address
      const match = tokenOptions.find(
        (token) => token.type === 'erc20' && token.address.toLowerCase() === sendTokenAddress.toLowerCase()
      )
      if (match) return match
      return sendForm.token
    }
    return tokenOptions[0]
  }, [sendForm.token, tokenOptions])

  const isErc20 = selectedToken.type === 'erc20'

  const { data: erc20Balance } = useReadContract({
    abi: erc20Abi,
    address: isErc20 ? selectedToken.address : undefined,
    functionName: 'balanceOf',
    args: isErc20 && address ? [address] : undefined,
    chainId,
    query: {
      enabled: Boolean(isErc20 && address),
    },
  })

  const selectedBalanceValue = isErc20 ? erc20Balance : nativeValue

  const parsedAmount = useMemo(() => {
    const rawAmount = sanitiseForParsing(sendForm.amount)
    if (!rawAmount) return null
    try {
      return parseUnits(rawAmount, selectedToken.decimals)
    } catch (error) {
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

  const onSelectToken = (token: SendTokenOption) => {
    setSendForm((prev) => {
      const shouldResetAmount = !isSameToken(prev.token, token)
      return {
        ...prev,
        token,
        amount: shouldResetAmount ? '' : prev.amount,
      }
    })
  }

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
          <TokenOptions>
            {tokenOptions.map((token) => {
              const key = token.type === 'erc20' ? token.address : 'native'
              const selected = isSameToken(token, selectedToken)
              return (
                <TokenOptionButton key={key} type="button" $selected={selected} onClick={() => onSelectToken(token)}>
                  {token.symbol}
                </TokenOptionButton>
              )
            })}
          </TokenOptions>
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
              style={{ marginTop: 8, paddingRight: '72px' }}
            />
            <MaxButton type="button" onClick={handleMax}>
              Max
            </MaxButton>
          </AmountInputWrapper>
          <HelperText>
            Available: {formatBalance(selectedBalanceValue, selectedToken.decimals)} {selectedToken.symbol}
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
