import { useEffect, useMemo } from 'react'
import type { Address } from 'viem'
import { encodeFunctionData, isAddress, parseUnits } from 'viem'
import {
  useAccount,
  useBalance,
  useEstimateFeesPerGas,
  useEstimateGas,
  useReadContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { truncateEthAddress } from '../../../utils'
import Button from '../../Common/Button'
import { CopyText } from '../../Common/CopyToClipboard'
import { ModalBody, ModalH1, PageContent } from '../../Common/Modal/styles'
import { defaultSendFormState, routes, type SendTokenOption } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { erc20Abi } from '../Send/erc20'
import { ERC20_TOKEN_LIST } from '../Send/tokenList'
import { formatBalance, sanitiseForParsing } from '../Send/utils'
import {
  AddressValue,
  ButtonRow,
  GasInfo,
  StatusMessage,
  SummaryItem,
  SummaryLabel,
  SummaryList,
  SummaryValue,
  TransactionLink,
} from './styles'

const SendConfirmation = () => {
  const { address, chain } = useAccount()
  const { sendForm, setRoute, setSendForm, triggerResize } = useOpenfort()
  const chainId = chain?.id

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

  const { data: gasEstimate } = useEstimateGas({
    account: address,
    to: token.type === 'erc20' ? token.address : recipientAddress,
    value: token.type === 'native' && parsedAmount ? parsedAmount : undefined,
    data: transferData,
    chainId,
    query: {
      enabled: Boolean(address && recipientAddress && parsedAmount && parsedAmount > BigInt(0)),
    },
  })

  const { data: feeData } = useEstimateFeesPerGas({
    chainId,
    query: {
      enabled: Boolean(chainId),
    },
  })

  const gasPrice = feeData?.gasPrice ?? feeData?.maxFeePerGas
  const gasCost = gasEstimate && gasPrice ? gasEstimate * gasPrice : undefined

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
    setRoute(routes.SEND)
  }

  const handleFinish = () => {
    setSendForm(() => ({
      ...defaultSendFormState,
      token: { ...defaultSendFormState.token },
    }))
    setRoute(routes.PROFILE)
  }

  const status: 'idle' | 'success' | 'error' = isSuccess ? 'success' : firstError ? 'error' : 'idle'
  const statusMessage =
    status === 'error'
      ? firstError instanceof Error
        ? firstError.message
        : 'Transaction failed.'
      : isLoading
        ? 'Awaiting transaction confirmation...'
        : ''

  const blockExplorerUrl = chain?.blockExplorers?.default?.url

  useEffect(() => {
    triggerResize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusMessage, insufficientBalance, receipt?.transactionHash, isLoading])

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
          <SummaryValue>
            {normalisedAmount || '0'} {token.symbol}
          </SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Current balance</SummaryLabel>
          <SummaryValue>
            {formatBalance(currentBalance, token.decimals)} {token.symbol}
          </SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Estimated gas</SummaryLabel>
          <SummaryValue>
            {gasEstimate ? gasEstimate.toString() : '--'}
            {gasCost ? <GasInfo>≈ {formatBalance(gasCost, 18)} ETH</GasInfo> : null}
          </SummaryValue>
        </SummaryItem>
      </SummaryList>

      {insufficientBalance && <StatusMessage $status="error">Insufficient balance for this transfer.</StatusMessage>}

      {statusMessage && <StatusMessage $status={status}>{statusMessage}</StatusMessage>}

      {isSuccess && receipt?.transactionHash && (
        <StatusMessage $status="success">
          Transaction confirmed:{' '}
          {blockExplorerUrl ? (
            <TransactionLink
              href={`${blockExplorerUrl}/tx/${receipt.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {receipt.transactionHash}
            </TransactionLink>
          ) : (
            receipt.transactionHash
          )}
        </StatusMessage>
      )}

      <ButtonRow>
        {isSuccess ? (
          <Button variant="primary" onClick={handleFinish}>
            Back to profile
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={!recipientAddress || !parsedAmount || parsedAmount <= BigInt(0) || insufficientBalance}
              waiting={isLoading}
            >
              Confirm
            </Button>
            <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
          </>
        )}
      </ButtonRow>
    </PageContent>
  )
}

export default SendConfirmation
