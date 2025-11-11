import { useEffect, useMemo, useRef, useState } from 'react'
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
import { useWalletAssets } from '../../../hooks/openfort/useWalletAssets'
import { truncateEthAddress } from '../../../utils'
import { parseTransactionError } from '../../../utils/errorHandling'
import { logger } from '../../../utils/logger'
import Button from '../../Common/Button'
import { CopyText } from '../../Common/CopyToClipboard/CopyText'
import { ModalBody, ModalHeading } from '../../Common/Modal/styles'
import { Spinner } from '../../Common/Spinner'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { formatBalance, getAssetDecimals, getAssetSymbol, isSameToken, sanitizeForParsing } from '../Send/utils'
import { EstimatedFees } from './EstimatedFees'
import {
  AddressValue,
  AmountValue,
  BalanceSpinnerWrapper,
  ButtonRow,
  CheckIconWrapper,
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

  const recipientAddress = isAddress(sendForm.recipient) ? (sendForm.recipient as Address) : undefined
  const normalisedAmount = sanitizeForParsing(sendForm.amount)

  const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance({
    address,
    query: {
      enabled: !!address,
    },
  })

  const { data: assets } = useWalletAssets()
  const matchedToken = useMemo(
    () => assets?.find((asset) => isSameToken(asset, sendForm.asset)),
    [assets, sendForm.asset]
  )

  const selectedTokenOption = matchedToken ?? assets?.[0]
  const token = selectedTokenOption ?? sendForm.asset

  const isErc20 = token.type === 'erc20'

  const { data: erc20Balance, refetch: refetchErc20Balance } = useReadContract({
    abi: erc20Abi,
    address: isErc20 ? token.address : undefined,
    functionName: 'balanceOf',
    args: isErc20 && address ? [address] : undefined,
    chainId,
    query: {
      enabled: Boolean(isErc20 && address),
    },
  })

  const parsedAmount =
    normalisedAmount && token && getAssetDecimals(token) !== undefined
      ? (() => {
          try {
            return parseUnits(normalisedAmount, getAssetDecimals(token))
          } catch (_error) {
            return null
          }
        })()
      : null

  useEffect(() => {
    if (!recipientAddress || parsedAmount === null || parsedAmount <= BigInt(0)) {
      logger.log('INVALID - recipientAddress:', recipientAddress, 'parsedAmount:', parsedAmount)
      // setRoute(routes.SEND)
    }
  }, [recipientAddress, parsedAmount, setRoute])

  const currentBalance = isErc20 ? erc20Balance : nativeBalance?.value

  const insufficientBalance =
    parsedAmount !== null && currentBalance !== undefined ? parsedAmount > currentBalance : false

  // Track original balance and polling state
  const [isPollingBalance, setIsPollingBalance] = useState(false)
  const originalBalanceRef = useRef<bigint | undefined>(undefined)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

  // Store original balance when transaction starts
  useEffect(() => {
    if (isSubmitting && originalBalanceRef.current === undefined) {
      originalBalanceRef.current = currentBalance
    }
  }, [isSubmitting, currentBalance])

  // Poll balance when transaction is successful until it changes
  useEffect(() => {
    if (isSuccess && originalBalanceRef.current !== undefined) {
      // Start polling
      setIsPollingBalance(true)

      const refetchBalance = isErc20 ? refetchErc20Balance : refetchNativeBalance

      // Immediate first refetch
      refetchBalance()

      // Set up interval for polling every 3 seconds
      pollingIntervalRef.current = setInterval(() => {
        refetchBalance()
      }, 3000)
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [isSuccess, isErc20, refetchErc20Balance, refetchNativeBalance])

  // Stop polling when balance changes
  useEffect(() => {
    if (isPollingBalance && currentBalance !== undefined && originalBalanceRef.current !== undefined) {
      if (currentBalance !== originalBalanceRef.current) {
        setIsPollingBalance(false)
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
      }
    }
  }, [isPollingBalance, currentBalance])

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
    // Clear polling interval if still running
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    setIsPollingBalance(false)

    // Don't reset the form - keep amount, token, and recipient for easier repeat transactions
    // Clear cached token after successful transaction
    // clearSelectedToken()
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
  }, [errorDetails, insufficientBalance, receipt?.transactionHash, isLoading])

  return (
    <PageContent>
      <ModalHeading>Confirm transfer</ModalHeading>
      <ModalBody>Review the transaction details before sending.</ModalBody>

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
          <AmountValue $completed={isSuccess}>
            -{normalisedAmount || '0'} {getAssetSymbol(token)}
            {isSuccess && (
              <CheckIconWrapper>
                <TickIcon />
              </CheckIconWrapper>
            )}
          </AmountValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>{isSuccess ? 'New balance' : 'Current balance'}</SummaryLabel>
          <SummaryValue>
            {formatBalance(currentBalance, getAssetDecimals(token))} {getAssetSymbol(token)}
            {isPollingBalance && (
              <BalanceSpinnerWrapper>
                <Spinner />
              </BalanceSpinnerWrapper>
            )}
          </SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Estimated fees</SummaryLabel>
          <FeesValue $completed={isSuccess}>
            <EstimatedFees
              account={address}
              to={token.type === 'erc20' ? token.address : recipientAddress}
              value={token.type === 'native' && parsedAmount ? parsedAmount : undefined}
              data={transferData}
              chainId={chainId}
              nativeSymbol={nativeBalance?.symbol || 'ETH'}
              enabled={Boolean(address && recipientAddress && parsedAmount && parsedAmount > BigInt(0))}
              hideInfoIcon={isSuccess}
            />
            {isSuccess && (
              <CheckIconWrapper>
                <TickIcon />
              </CheckIconWrapper>
            )}
          </FeesValue>
        </SummaryItem>
      </SummaryList>

      {insufficientBalance && !isSuccess && (
        <StatusMessage $status="error">Insufficient balance for this transfer.</StatusMessage>
      )}

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

// const SendConfirmation = () => {
//   return <div>Send Confirmation - TODO</div>
// }
export default SendConfirmation
