import { useEffect, useMemo } from 'react'
import type { Address } from 'viem'
import { encodeFunctionData, isAddress, parseUnits } from 'viem'
import {
  useAccount,
  useBalance,
  useReadContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { TickIcon } from '../../../assets/icons'
import { erc20Abi } from '../../../constants/erc20'
import { ERC20_TOKEN_LIST } from '../../../constants/tokenList'
import { useTokenCache } from '../../../hooks/useTokenCache'
import { useTokens } from '../../../hooks/useTokens'
import { truncateEthAddress } from '../../../utils'
import { parseTransactionError } from '../../../utils/errorHandling'
import Button from '../../Common/Button'
import { CopyText } from '../../Common/CopyToClipboard'
import { ModalBody, ModalH1, PageContent } from '../../Common/Modal/styles'
import { routes, type SendTokenOption } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { formatBalance, sanitiseForParsing } from '../Send/utils'
import { EstimatedFees } from './EstimatedFees'
import {
  AddressValue,
  AmountValue,
  ButtonRow,
  ErrorAction,
  ErrorContainer,
  ErrorMessage,
  ErrorTitle,
  FeesValue,
  StatusMessage,
  SummaryItem,
  SummaryLabel,
  SummaryList,
  SummaryValue,
} from './styles'

const SendConfirmation = () => {
  const { address, chain } = useAccount()
  const { sendForm, setRoute, triggerResize } = useOpenfort()
  const chainId = chain?.id
  const { clearSelectedToken } = useTokenCache(address, chainId)
  const { prices: usdPrices } = useTokens()

  const recipientAddress = isAddress(sendForm.recipient) ? (sendForm.recipient as Address) : undefined
  const normalisedAmount = sanitiseForParsing(sendForm.amount)
  const parsedAmount =
    normalisedAmount && sendForm.token.decimals !== undefined
      ? (() => {
          try {
            return parseUnits(normalisedAmount, sendForm.token.decimals)
          } catch (_error) {
            return null
          }
        })()
      : null

  useEffect(() => {
    if (!recipientAddress || parsedAmount === null || parsedAmount <= BigInt(0)) {
      setRoute(routes.SEND)
    }
  }, [recipientAddress, parsedAmount, setRoute])

  const { data: nativeBalance } = useBalance({
    address,
    query: {
      enabled: !!address,
    },
  })

  const erc20Tokens = useMemo(() => {
    if (!chainId) return []
    return ERC20_TOKEN_LIST[chainId] ?? []
  }, [chainId])

  const token: SendTokenOption = useMemo(() => {
    if (sendForm.token.type === 'erc20') {
      const sendTokenAddress = sendForm.token.address
      const match = erc20Tokens.find((item) => item.address.toLowerCase() === sendTokenAddress.toLowerCase())
      if (match) {
        return {
          type: 'erc20',
          symbol: match.symbol,
          decimals: match.decimals,
          address: match.address,
          name: match.name,
        }
      }
      return sendForm.token
    }

    return {
      type: 'native',
      symbol: nativeBalance?.symbol || sendForm.token.symbol || 'ETH',
      decimals: nativeBalance?.decimals ?? sendForm.token.decimals ?? 18,
    }
  }, [erc20Tokens, nativeBalance?.decimals, nativeBalance?.symbol, sendForm.token])

  const isErc20 = token.type === 'erc20'

  const { data: erc20Balance } = useReadContract({
    abi: erc20Abi,
    address: isErc20 ? token.address : undefined,
    functionName: 'balanceOf',
    args: isErc20 && address ? [address] : undefined,
    chainId,
    query: {
      enabled: Boolean(isErc20 && address),
    },
  })

  const currentBalance = isErc20 ? erc20Balance : nativeBalance?.value

  const insufficientBalance =
    parsedAmount !== null && currentBalance !== undefined ? parsedAmount > currentBalance : false

  const {
    sendTransactionAsync,
    data: nativeTxHash,
    isPending: isNativePending,
    error: nativeError,
  } = useSendTransaction()
  const { writeContractAsync, data: erc20TxHash, isPending: isTokenPending, error: erc20Error } = useWriteContract()

  const transactionHash = nativeTxHash ?? erc20TxHash

  const transferData =
    recipientAddress && parsedAmount !== null && parsedAmount > BigInt(0)
      ? token.type === 'erc20'
        ? encodeFunctionData({
            abi: erc20Abi,
            functionName: 'transfer',
            args: [recipientAddress, parsedAmount],
          })
        : undefined
      : undefined

  const {
    data: receipt,
    isLoading: isWaitingForReceipt,
    isSuccess,
    isError: _receiptError,
    error: waitError,
  } = useWaitForTransactionReceipt({
    hash: transactionHash,
    chainId,
    query: {
      enabled: Boolean(transactionHash),
    },
  })

  const isSubmitting = isNativePending || isTokenPending
  const isLoading = isSubmitting || isWaitingForReceipt

  const firstError = nativeError || erc20Error || waitError

  const handleConfirm = async () => {
    if (!recipientAddress || !parsedAmount || parsedAmount <= BigInt(0) || insufficientBalance) return

    try {
      if (token.type === 'native') {
        await sendTransactionAsync({
          to: recipientAddress,
          value: parsedAmount,
          chainId,
        })
      } else {
        await writeContractAsync({
          abi: erc20Abi,
          address: token.address,
          functionName: 'transfer',
          args: [recipientAddress, parsedAmount],
          chainId,
        })
      }
    } catch (_error) {
      // Errors are surfaced through mutation hooks
    }
  }

  const handleCancel = () => {
    // Keep the current token, amount, and recipient when going back - don't reset
    setRoute(routes.SEND)
  }

  const handleFinish = () => {
    // Don't reset the form - keep amount, token, and recipient for easier repeat transactions
    // Clear cached token after successful transaction
    clearSelectedToken()
    setRoute(routes.PROFILE)
  }

  const status: 'idle' | 'success' | 'error' = isSuccess ? 'success' : firstError ? 'error' : 'idle'
  const errorDetails = status === 'error' ? parseTransactionError(firstError) : null

  const blockExplorerUrl = chain?.blockExplorers?.default?.url

  const handleOpenBlockExplorer = () => {
    if (receipt?.transactionHash && blockExplorerUrl) {
      window.open(`${blockExplorerUrl}/tx/${receipt.transactionHash}`, '_blank', 'noopener,noreferrer')
    }
  }

  useEffect(() => {
    setTimeout(triggerResize, 10) // delay required here for modal to resize
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorDetails, insufficientBalance, receipt?.transactionHash, isLoading])

  return (
    <PageContent>
      <ModalH1>Confirm transfer</ModalH1>
      <ModalBody style={{ marginTop: 8 }}>Review the transaction details before sending.</ModalBody>

      <SummaryList>
        <SummaryItem>
          <SummaryLabel>Recipient</SummaryLabel>
          <AddressValue>
            {recipientAddress ? (
              <CopyText value={recipientAddress}>{truncateEthAddress(recipientAddress)}</CopyText>
            ) : (
              '--'
            )}
          </AddressValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Amount</SummaryLabel>
          <AmountValue>
            -{normalisedAmount || '0'} {token.symbol}
          </AmountValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Current balance</SummaryLabel>
          <SummaryValue>
            {formatBalance(currentBalance, token.decimals)} {token.symbol}
          </SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Estimated fees</SummaryLabel>
          <FeesValue>
            <EstimatedFees
              account={address}
              to={token.type === 'erc20' ? token.address : recipientAddress}
              value={token.type === 'native' && parsedAmount ? parsedAmount : undefined}
              data={transferData}
              chainId={chainId}
              nativeSymbol={nativeBalance?.symbol || 'ETH'}
              usdPrices={usdPrices}
              enabled={Boolean(address && recipientAddress && parsedAmount && parsedAmount > BigInt(0))}
            />
          </FeesValue>
        </SummaryItem>
      </SummaryList>

      {insufficientBalance && <StatusMessage $status="error">Insufficient balance for this transfer.</StatusMessage>}

      {errorDetails && (
        <ErrorContainer>
          <ErrorTitle>{errorDetails.title}</ErrorTitle>
          <ErrorMessage>{errorDetails.message}</ErrorMessage>
          {errorDetails.action && <ErrorAction>{errorDetails.action}</ErrorAction>}
        </ErrorContainer>
      )}

      <ButtonRow>
        <Button
          variant="primary"
          onClick={isSuccess ? handleOpenBlockExplorer : handleConfirm}
          disabled={
            isSuccess ? false : !recipientAddress || !parsedAmount || parsedAmount <= BigInt(0) || insufficientBalance
          }
          waiting={isLoading}
          icon={isSuccess ? <TickIcon style={{ width: 18, height: 18 }} /> : undefined}
        >
          {isSuccess ? 'Confirmed' : isLoading ? 'Confirming...' : 'Confirm'}
        </Button>
        {isSuccess ? (
          <Button variant="secondary" onClick={handleFinish}>
            Back to profile
          </Button>
        ) : (
          <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </ButtonRow>
    </PageContent>
  )
}

export default SendConfirmation
