import type { Address } from 'viem'
import { formatUnits } from 'viem'
import { useEstimateFeesPerGas, useEstimateGas } from 'wagmi'
import Tooltip from '../../Common/Tooltip'
import { formatBalance } from '../Send/utils'
import { InfoIconWrapper } from './styles'

const InfoIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 10V6.5M7 4.5H7.005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
})

type EstimatedFeesProps = {
  account: Address | undefined
  to: Address | undefined
  value: bigint | undefined
  data: `0x${string}` | undefined
  chainId: number | undefined
  nativeSymbol: string
  usdPrices: Record<string, number>
  enabled?: boolean
  hideInfoIcon?: boolean
}

export const EstimatedFees = ({
  account,
  to,
  value,
  data,
  chainId,
  nativeSymbol,
  usdPrices,
  enabled = true,
  hideInfoIcon = false,
}: EstimatedFeesProps) => {
  const { data: gasEstimate } = useEstimateGas({
    account,
    to,
    value,
    data,
    chainId,
    query: {
      enabled,
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

  if (!gasCost) {
    return <>--</>
  }

  const pricePerToken = usdPrices[nativeSymbol.toUpperCase()]

  if (pricePerToken !== undefined) {
    const gasCostInEth = Number.parseFloat(formatUnits(gasCost, 18))
    const gasCostInUsd = gasCostInEth * pricePerToken

    return (
      <>
        ≈ {usdFormatter.format(gasCostInUsd)}
        {!hideInfoIcon && (
          <Tooltip message={`${gasEstimate?.toString()} gas units (paid in ${nativeSymbol})`} delay={0.2}>
            <InfoIconWrapper>
              <InfoIcon />
            </InfoIconWrapper>
          </Tooltip>
        )}
      </>
    )
  }

  // Fallback to native token if price not available
  return (
    <>
      ≈ {formatBalance(gasCost, 18)} {nativeSymbol}
      {!hideInfoIcon && (
        <Tooltip message={`${gasEstimate?.toString()} gas units`} delay={0.2}>
          <InfoIconWrapper>
            <InfoIcon />
          </InfoIconWrapper>
        </Tooltip>
      )}
    </>
  )
}
