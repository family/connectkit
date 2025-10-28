/**
 * Parses common Web3/RPC errors and returns user-friendly error messages
 * Covers errors from viem, wagmi, and blockchain interactions
 * Based on viem error types: https://v1.viem.sh/docs/glossary/errors.html
 */
export function parseTransactionError(error: unknown): {
  title: string
  message: string
  action?: string
} {
  if (!error) {
    return {
      title: 'Transaction failed',
      message: 'An unknown error occurred.',
    }
  }

  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorString = errorMessage.toLowerCase()
  const errorName = error instanceof Error ? error.name : ''

  // ==========================================
  // WALLET & USER INTERACTION ERRORS
  // ==========================================

  // UserRejectedRequestError - User explicitly denied/rejected the request
  // https://v1.viem.sh/docs/glossary/errors.html#userrejectedrequesterror
  if (
    errorName === 'UserRejectedRequestError' ||
    errorString.includes('user rejected') ||
    errorString.includes('user denied') ||
    errorString.includes('user cancelled') ||
    errorString.includes('user canceled') ||
    errorString.includes('rejected the request') ||
    errorString.includes('transaction was rejected')
  ) {
    return {
      title: 'Transaction cancelled',
      message: 'You cancelled the transaction.',
    }
  }

  // AccountNotFoundError - No account provided to action that requires one
  // https://v1.viem.sh/docs/glossary/errors.html#accountnotfounderror
  if (errorName === 'AccountNotFoundError' || errorString.includes('account not found')) {
    return {
      title: 'Account not found',
      message: 'No account is connected.',
      action: 'Please connect your wallet and try again.',
    }
  }

  // ==========================================
  // TRANSACTION & GAS ERRORS
  // ==========================================

  // InsufficientFundsError - Not enough funds for gas
  // https://v1.viem.sh/docs/glossary/errors.html#insufficientfundserror
  if (
    errorName === 'InsufficientFundsError' ||
    errorString.includes('insufficient funds') ||
    errorString.includes('insufficient balance') ||
    errorString.includes('exceeds balance') ||
    errorString.includes('insufficient eth') ||
    errorString.includes("sender doesn't have enough funds")
  ) {
    return {
      title: 'Insufficient funds',
      message: "You don't have enough ETH to pay for the gas fee.",
      action: 'Add more ETH to your wallet to cover the transaction fee.',
    }
  }

  // EstimateGasExecutionError - Gas estimation failed
  // https://v1.viem.sh/docs/glossary/errors.html#estimategasexecutionerror
  if (
    errorName === 'EstimateGasExecutionError' ||
    errorString.includes('gas estimation failed') ||
    errorString.includes('cannot estimate gas') ||
    errorString.includes('gas required exceeds allowance') ||
    errorString.includes('out of gas')
  ) {
    // Check for specific reasons
    if (errorString.includes('insufficient funds')) {
      return {
        title: 'Insufficient funds',
        message: "You don't have enough ETH to pay for this transaction.",
        action: 'Add more ETH to your wallet.',
      }
    }

    return {
      title: 'Transaction would fail',
      message: 'This transaction is likely to fail.',
      action: 'Please check the recipient address and amount, then try again.',
    }
  }

  // IntrinsicGasTooHighError / IntrinsicGasTooLowError - Gas limit issues
  // https://v1.viem.sh/docs/glossary/errors.html#intrinsicgastoohigherror
  if (
    errorName === 'IntrinsicGasTooHighError' ||
    errorName === 'IntrinsicGasTooLowError' ||
    errorString.includes('intrinsic gas too high') ||
    errorString.includes('intrinsic gas too low') ||
    errorString.includes('gas limit')
  ) {
    return {
      title: 'Gas limit error',
      message: 'The gas limit for this transaction is incorrect.',
      action: 'Please try again or contact support.',
    }
  }

  // NonceTooLowError / NonceTooHighError - Nonce issues
  // https://v1.viem.sh/docs/glossary/errors.html#noncetoolowerror
  if (errorName === 'NonceTooLowError' || errorString.includes('nonce too low')) {
    return {
      title: 'Transaction pending',
      message: 'A transaction is already pending.',
      action: 'Please wait for your pending transaction to complete.',
    }
  }

  if (
    errorName === 'NonceTooHighError' ||
    errorName === 'NonceMaxValueError' ||
    errorString.includes('nonce too high')
  ) {
    return {
      title: 'Transaction error',
      message: 'Transaction nonce is invalid.',
      action: 'Please refresh the page and try again.',
    }
  }

  // FeeCapTooHighError / FeeCapTooLowError / TipAboveFeeCapError
  // https://v1.viem.sh/docs/glossary/errors.html#feecaptoohigherror
  if (
    errorName === 'FeeCapTooLowError' ||
    errorName === 'TipAboveFeeCapError' ||
    errorString.includes('transaction underpriced') ||
    errorString.includes('replacement transaction underpriced') ||
    errorString.includes('fee cap too low')
  ) {
    return {
      title: 'Gas fee too low',
      message: 'The gas fee is too low for this transaction.',
      action: 'Try again with a higher gas fee.',
    }
  }

  if (errorName === 'FeeCapTooHighError' || errorString.includes('fee cap too high')) {
    return {
      title: 'Gas fee too high',
      message: 'The gas fee is unusually high.',
      action: 'Please check the fee and try again.',
    }
  }

  // TransactionTypeNotSupportedError
  // https://v1.viem.sh/docs/glossary/errors.html#transactiontypenotsupportederror
  if (errorName === 'TransactionTypeNotSupportedError' || errorString.includes('transaction type not supported')) {
    return {
      title: 'Transaction not supported',
      message: 'This transaction type is not supported on this network.',
      action: 'Please try a different transaction method.',
    }
  }

  // TransactionExecutionError - General transaction execution failure
  // https://v1.viem.sh/docs/glossary/errors.html#transactionexecutionerror
  if (errorName === 'TransactionExecutionError') {
    return {
      title: 'Transaction failed',
      message: 'The transaction failed to execute.',
      action: 'Please check the transaction details and try again.',
    }
  }

  // WaitForTransactionReceiptTimeoutError
  // https://v1.viem.sh/docs/glossary/errors.html#waitfortransactionreceipttimeouterror
  if (errorName === 'WaitForTransactionReceiptTimeoutError' || errorString.includes('timeout')) {
    return {
      title: 'Transaction timeout',
      message: 'The transaction is taking longer than expected.',
      action: 'It may still be processing. Check your wallet or block explorer.',
    }
  }

  // ==========================================
  // CONTRACT EXECUTION ERRORS
  // ==========================================

  // ExecutionRevertedError - Contract execution reverted
  // https://v1.viem.sh/docs/glossary/errors.html#executionrevertederror
  if (errorName === 'ExecutionRevertedError' || errorString.includes('execution reverted')) {
    // Try to extract revert reason if available
    const reasonMatch = errorMessage.match(/execution reverted:?\s*([^(]+)/i)
    const reason = reasonMatch?.[1]?.trim()

    if (reason && reason.length > 0 && reason.length < 100) {
      return {
        title: 'Transaction failed',
        message: reason,
        action: 'Please check the transaction details and try again.',
      }
    }

    return {
      title: 'Transaction failed',
      message: 'The transaction was rejected by the contract.',
      action: 'Please check the transaction details and try again.',
    }
  }

  // ContractFunctionExecutionError / ContractFunctionRevertedError / CallExecutionError
  // https://v1.viem.sh/docs/glossary/errors.html#contractfunctionexecutionerror
  if (
    errorName === 'ContractFunctionExecutionError' ||
    errorName === 'ContractFunctionRevertedError' ||
    errorName === 'CallExecutionError' ||
    errorName === 'RawContractError'
  ) {
    // Try to extract custom error or reason
    const reasonMatch = errorMessage.match(/reason:\s*([^,\n]+)/i) || errorMessage.match(/reverted with:\s*([^,\n]+)/i)
    const reason = reasonMatch?.[1]?.trim()

    if (reason && reason.length > 0 && reason.length < 100) {
      return {
        title: 'Contract error',
        message: reason,
        action: 'Please check the transaction details and try again.',
      }
    }

    return {
      title: 'Contract error',
      message: 'The contract rejected this transaction.',
      action: 'Please verify the transaction parameters and try again.',
    }
  }

  // ContractFunctionZeroDataError - No data returned when expected
  // https://v1.viem.sh/docs/glossary/errors.html#contractfunctionzerodataerror
  if (errorName === 'ContractFunctionZeroDataError') {
    return {
      title: 'Contract error',
      message: 'The contract returned no data.',
      action: 'This contract may not exist on this network.',
    }
  }

  // ABI-related errors
  // https://v1.viem.sh/docs/glossary/errors.html#abi
  if (errorName.includes('Abi') || errorString.includes('abi encoding') || errorString.includes('abi decoding')) {
    return {
      title: 'Contract error',
      message: 'Unable to encode or decode the contract data.',
      action: 'Please contact support if this issue persists.',
    }
  }

  // ==========================================
  // NETWORK & RPC ERRORS
  // ==========================================

  // ChainMismatchError / ChainNotFoundError / InvalidChainIdError
  // https://v1.viem.sh/docs/glossary/errors.html#chainmismatcherror
  if (
    errorName === 'ChainMismatchError' ||
    errorName === 'ChainNotFoundError' ||
    errorName === 'InvalidChainIdError' ||
    (errorString.includes('chain') && (errorString.includes('mismatch') || errorString.includes('wrong')))
  ) {
    return {
      title: 'Wrong network',
      message: 'Your wallet is connected to a different network.',
      action: 'Please switch to the correct network in your wallet.',
    }
  }

  // SwitchChainError
  // https://v1.viem.sh/docs/glossary/errors.html#switchchainerror
  if (errorName === 'SwitchChainError' || errorString.includes('switch chain')) {
    return {
      title: 'Network switch failed',
      message: 'Unable to switch to the requested network.',
      action: 'Please manually switch networks in your wallet.',
    }
  }

  // ChainDisconnectedError / ProviderDisconnectedError
  // https://v1.viem.sh/docs/glossary/errors.html#chaindisconnectederror
  if (
    errorName === 'ChainDisconnectedError' ||
    errorName === 'ProviderDisconnectedError' ||
    errorString.includes('disconnected')
  ) {
    return {
      title: 'Connection lost',
      message: 'Lost connection to the network.',
      action: 'Please check your internet connection and try again.',
    }
  }

  // HttpRequestError / WebSocketRequestError / RpcRequestError / TimeoutError
  // https://v1.viem.sh/docs/glossary/errors.html#httprequesterror
  if (
    errorName === 'HttpRequestError' ||
    errorName === 'WebSocketRequestError' ||
    errorName === 'RpcRequestError' ||
    errorName === 'TimeoutError' ||
    errorString.includes('network') ||
    errorString.includes('timed out') ||
    errorString.includes('connection') ||
    errorString.includes('failed to fetch') ||
    errorString.includes('request failed') ||
    errorString.includes('could not detect network') ||
    errorString.includes('bad gateway') ||
    errorString.includes('service unavailable')
  ) {
    return {
      title: 'Network error',
      message: 'Unable to connect to the network.',
      action: 'Check your internet connection and try again.',
    }
  }

  // InternalRpcError / UnknownRpcError
  // https://v1.viem.sh/docs/glossary/errors.html#internalrpcerror
  if (
    errorName === 'InternalRpcError' ||
    errorName === 'UnknownRpcError' ||
    errorString.includes('internal json-rpc error') ||
    errorString.includes('internal error')
  ) {
    return {
      title: 'Network error',
      message: 'The network encountered an internal error.',
      action: 'Please try again in a moment.',
    }
  }

  // MethodNotFoundRpcError / MethodNotSupportedRpcError
  // https://v1.viem.sh/docs/glossary/errors.html#methodnotfoundrpcerror
  if (
    errorName === 'MethodNotFoundRpcError' ||
    errorName === 'MethodNotSupportedRpcError' ||
    errorName === 'UnsupportedProviderMethodError' ||
    (errorString.includes('method') && (errorString.includes('not found') || errorString.includes('not supported')))
  ) {
    return {
      title: 'Method not supported',
      message: 'This operation is not supported by the current network.',
      action: 'Try switching to a different RPC provider.',
    }
  }

  // InvalidInputRpcError / InvalidParamsRpcError / InvalidRequestRpcError
  // https://v1.viem.sh/docs/glossary/errors.html#invalidinputrpcerror
  if (
    errorName === 'InvalidInputRpcError' ||
    errorName === 'InvalidParamsRpcError' ||
    errorName === 'InvalidRequestRpcError'
  ) {
    return {
      title: 'Invalid request',
      message: 'The request contains invalid parameters.',
      action: 'Please check the transaction details and try again.',
    }
  }

  // TransactionRejectedRpcError
  // https://v1.viem.sh/docs/glossary/errors.html#transactionrejectedrpcerror
  if (errorName === 'TransactionRejectedRpcError' || errorString.includes('transaction rejected')) {
    return {
      title: 'Transaction rejected',
      message: 'The network rejected this transaction.',
      action: 'Please check the transaction details and try again.',
    }
  }

  // LimitExceededRpcError / ResourceNotFoundRpcError / ResourceUnavailableRpcError
  // https://v1.viem.sh/docs/glossary/errors.html#limitexceededrpcerror
  if (
    errorName === 'LimitExceededRpcError' ||
    errorName === 'ResourceNotFoundRpcError' ||
    errorName === 'ResourceUnavailableRpcError'
  ) {
    return {
      title: 'Network busy',
      message: 'The network is currently busy or unavailable.',
      action: 'Please wait a moment and try again.',
    }
  }

  // UnauthorizedProviderError
  // https://v1.viem.sh/docs/glossary/errors.html#unauthorizedprovidererror
  if (errorName === 'UnauthorizedProviderError' || errorString.includes('unauthorized')) {
    return {
      title: 'Unauthorized',
      message: 'This action requires authorization.',
      action: 'Please connect your wallet and try again.',
    }
  }

  // Wallet/Provider not found
  if (errorString.includes('wallet') && (errorString.includes('not connected') || errorString.includes('not found'))) {
    return {
      title: 'Wallet not connected',
      message: 'Your wallet is not connected.',
      action: 'Please connect your wallet and try again.',
    }
  }

  if (errorString.includes('provider') && errorString.includes('not found')) {
    return {
      title: 'Wallet not found',
      message: 'No wallet extension detected.',
      action: 'Please install a wallet extension and try again.',
    }
  }

  // ==========================================
  // GENERIC FALLBACK
  // ==========================================

  // If error message is reasonably short and readable, show it
  if (errorMessage.length < 150 && !errorMessage.includes('0x')) {
    return {
      title: 'Transaction failed',
      message: errorMessage,
      action: 'Please try again.',
    }
  }

  // Generic fallback
  return {
    title: 'Transaction failed',
    message: 'An error occurred while processing your transaction.',
    action: 'Please try again.',
  }
}
