import type { SendTokenOption } from '../../Openfort/types'
import type { ProviderDefinition } from './providers'

type QuoteFetchParams = {
  provider: ProviderDefinition
  fiatAmount: number
  fiatCurrency: string
  token: SendTokenOption
  signal?: AbortSignal
}

export type QuoteFetchResult = {
  tokenAmount: number | null
  totalFiatAmount: number | null
  feeFiatAmount: number | null
  rate: number | null
  raw?: unknown
}

type TokenIdentifier = {
  standardSymbol: string
  coinbaseSymbol: string
  moonpayCode: string
  stripeCurrency: string
}

const TOKEN_MAP: Record<string, TokenIdentifier> = {
  ETH: {
    standardSymbol: 'ETH',
    coinbaseSymbol: 'ETH',
    moonpayCode: 'eth',
    stripeCurrency: 'eth',
  },
  USDC: {
    standardSymbol: 'USDC',
    coinbaseSymbol: 'USDC',
    moonpayCode: 'usdc',
    stripeCurrency: 'usdc',
  },
}

const MOONPAY_API_KEY = 'VITE_ONRAMP_MOONPAY_API_KEY'
const MOONPAY_BASE_URL_KEY = 'VITE_ONRAMP_MOONPAY_API_BASE_URL'

const COINBASE_BASE_URL_KEY = 'VITE_ONRAMP_COINBASE_API_BASE_URL'
const COINBASE_RAMP_URL_KEY = 'VITE_ONRAMP_COINBASE_RAMP_API_URL'
const COINBASE_ACCESS_TOKEN_KEY = 'VITE_ONRAMP_COINBASE_ACCESS_TOKEN'

const STRIPE_SECRET_KEY = 'VITE_ONRAMP_STRIPE_SECRET_KEY'
const STRIPE_PROXY_URL_KEY = 'VITE_ONRAMP_STRIPE_PROXY_URL'
const STRIPE_BASE_URL_KEY = 'VITE_ONRAMP_STRIPE_API_BASE_URL'

const DEFAULT_MOONPAY_BASE_URL = 'https://api.moonpay.com'
const DEFAULT_COINBASE_BASE_URL = 'https://api.coinbase.com'
const DEFAULT_STRIPE_BASE_URL = 'https://api.stripe.com'

const numberFromUnknown = (value: unknown): number | null => {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const getEnvValue = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
    const fromProcess = process.env[key]
    if (typeof fromProcess === 'string' && fromProcess.length > 0) return fromProcess
  }

  // Attempt to read from import.meta.env (Vite, modern bundlers). Wrapped in try/catch for compatibility.
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> })?.env
    const fromMeta = metaEnv?.[key]
    if (typeof fromMeta === 'string' && fromMeta.length > 0) return fromMeta
  } catch {
    // ignore
  }

  if (typeof globalThis !== 'undefined' && globalThis) {
    const globalRecord = globalThis as unknown as Record<string, unknown>
    const fromGlobal = globalRecord?.[key]
    if (typeof fromGlobal === 'string' && fromGlobal.length > 0) return fromGlobal
  }

  return undefined
}

const resolveTokenIdentifier = (token: SendTokenOption): TokenIdentifier | null => {
  const symbol = token.symbol?.toUpperCase()
  if (!symbol) return null
  return TOKEN_MAP[symbol] ?? null
}

const fetchMoonpayQuote = async (params: QuoteFetchParams, tokenIdentifier: TokenIdentifier): Promise<QuoteFetchResult> => {
  const apiKey = getEnvValue(MOONPAY_API_KEY)
  if (!apiKey) {
    throw new Error('MoonPay API key is not configured. Set VITE_ONRAMP_MOONPAY_API_KEY.')
  }

  const baseUrl = getEnvValue(MOONPAY_BASE_URL_KEY) ?? DEFAULT_MOONPAY_BASE_URL
  const url = new URL(`${baseUrl.replace(/\/$/, '')}/v3/currencies/${tokenIdentifier.moonpayCode}/quote`)
  url.searchParams.set('apiKey', apiKey)
  url.searchParams.set('baseCurrencyAmount', params.fiatAmount.toFixed(2))
  url.searchParams.set('baseCurrencyCode', params.fiatCurrency.toUpperCase())
  url.searchParams.set('areFeesIncluded', 'true')

  const response = await fetch(url.toString(), {
    method: 'GET',
    signal: params.signal,
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`MoonPay quote failed (${response.status}): ${errorBody || response.statusText}`)
  }

  const data = await response.json()

  const quoteCurrencyAmount = numberFromUnknown(data?.quoteCurrencyAmount)
  const baseCurrencyAmount = numberFromUnknown(data?.baseCurrencyAmount)
  // Some responses include totalAmount (with fees); fall back to base amount if undefined.
  const totalAmount = numberFromUnknown(data?.totalAmount) ?? baseCurrencyAmount
  const feeAmount = numberFromUnknown(data?.feeAmount) ?? numberFromUnknown(data?.fee) ?? null
  const exchangeRate = numberFromUnknown(data?.exchangeRate)

  const tokenAmount = quoteCurrencyAmount ?? null
  const totalFiatAmount = totalAmount ?? params.fiatAmount
  const feeFiatAmount = feeAmount
  const rate =
    exchangeRate ??
    (tokenAmount && tokenAmount > 0 && totalFiatAmount
      ? totalFiatAmount / tokenAmount
      : null)

  return {
    tokenAmount,
    totalFiatAmount,
    feeFiatAmount,
    rate,
    raw: data,
  }
}

const fetchCoinbaseQuote = async (
  params: QuoteFetchParams,
  tokenIdentifier: TokenIdentifier
): Promise<QuoteFetchResult> => {
  const baseUrl = getEnvValue(COINBASE_RAMP_URL_KEY) ?? getEnvValue(COINBASE_BASE_URL_KEY) ?? DEFAULT_COINBASE_BASE_URL
  const accessToken = getEnvValue(COINBASE_ACCESS_TOKEN_KEY)

  const url = new URL(
    `${baseUrl.replace(/\/$/, '')}/${
      baseUrl.includes('/ramp/') || baseUrl.includes('/v2/ramp') ? '' : 'v2/'
    }prices/${tokenIdentifier.coinbaseSymbol}-${params.fiatCurrency.toUpperCase()}/buy`
  )

  const headers: Record<string, string> = {}
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
    signal: params.signal,
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`Coinbase quote failed (${response.status}): ${errorBody || response.statusText}`)
  }

  const data = await response.json()
  const pricePerToken = numberFromUnknown(data?.data?.amount)
  if (!pricePerToken || pricePerToken <= 0) {
    throw new Error('Coinbase returned an invalid price')
  }

  const feeBps = params.provider.feeBps ?? 0
  const feeFiatAmount = ((params.fiatAmount * feeBps) / 10_000)
  const effectiveFiat = Math.max(params.fiatAmount - feeFiatAmount, 0)
  const tokenAmount = effectiveFiat / pricePerToken

  return {
    tokenAmount,
    totalFiatAmount: params.fiatAmount,
    feeFiatAmount,
    rate: pricePerToken,
    raw: data,
  }
}

const fetchStripeQuoteFromProxy = async (proxyUrl: string, params: QuoteFetchParams, tokenIdentifier: TokenIdentifier) => {
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: params.signal,
    body: JSON.stringify({
      sourceCurrency: params.fiatCurrency,
      sourceAmount: params.fiatAmount,
      destinationCurrency: tokenIdentifier.stripeCurrency,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`Stripe proxy quote failed (${response.status}): ${errorBody || response.statusText}`)
  }

  return response.json()
}

type StripeApiQuote = {
  id?: string
  destination_currency?: string
  destination_amount?: string | number
  destination_network?: string
  fees?: {
    network_fee_monetary?: string | number
    transaction_fee_monetary?: string | number
  }
  source_total_amount?: string | number
}

const selectStripeQuote = (data: any, tokenIdentifier: TokenIdentifier): StripeApiQuote | null => {
  const quotes = data?.destination_network_quotes
  if (!quotes || typeof quotes !== 'object') return null

  const lowered = tokenIdentifier.stripeCurrency.toLowerCase()

  for (const value of Object.values(quotes)) {
    if (!Array.isArray(value)) continue
    const match = value.find(
      (item) => typeof item?.destination_currency === 'string' && item.destination_currency.toLowerCase() === lowered
    )
    if (match) return match as StripeApiQuote
  }

  return null
}

const fetchStripeQuoteDirect = async (
  params: QuoteFetchParams,
  tokenIdentifier: TokenIdentifier,
  secretKey: string
): Promise<QuoteFetchResult> => {
  const baseUrl = getEnvValue(STRIPE_BASE_URL_KEY) ?? DEFAULT_STRIPE_BASE_URL
  const url = new URL(`${baseUrl.replace(/\/$/, '')}/v1/crypto/onramp/quotes`)
  url.searchParams.set('source_currency', params.fiatCurrency.toLowerCase())
  url.searchParams.set('source_amount', params.fiatAmount.toFixed(2))
  url.searchParams.append('destination_currencies[]', tokenIdentifier.stripeCurrency.toLowerCase())

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
    signal: params.signal,
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`Stripe quote failed (${response.status}): ${errorBody || response.statusText}`)
  }

  const data = await response.json()
  const quote = selectStripeQuote(data, tokenIdentifier)
  if (!quote) {
    throw new Error('Stripe quote not available for the requested token')
  }

  const destinationAmount = numberFromUnknown(quote.destination_amount)
  const sourceTotalAmount = numberFromUnknown(quote.source_total_amount)
  const networkFee = numberFromUnknown(quote.fees?.network_fee_monetary) ?? 0
  const transactionFee = numberFromUnknown(quote.fees?.transaction_fee_monetary) ?? 0
  const feeFiatAmount = networkFee + transactionFee

  const totalFiatAmount =
    sourceTotalAmount ??
    (params.fiatAmount > 0 ? params.fiatAmount + feeFiatAmount : params.fiatAmount)

  return {
    tokenAmount: destinationAmount ?? null,
    totalFiatAmount,
    feeFiatAmount,
    rate:
      destinationAmount && destinationAmount > 0 && totalFiatAmount
        ? totalFiatAmount / destinationAmount
        : null,
    raw: {
      stripeQuoteId: quote.id,
      stripeResponse: data,
    },
  }
}

const fetchStripeQuote = async (
  params: QuoteFetchParams,
  tokenIdentifier: TokenIdentifier
): Promise<QuoteFetchResult> => {
  const proxyUrl = getEnvValue(STRIPE_PROXY_URL_KEY)
  if (proxyUrl) {
    const proxyData = await fetchStripeQuoteFromProxy(proxyUrl, params, tokenIdentifier)
    const quote = selectStripeQuote(proxyData, tokenIdentifier)
    if (!quote) {
      throw new Error('Stripe proxy did not return a usable quote')
    }

    const destinationAmount = numberFromUnknown(quote.destination_amount)
    const sourceTotalAmount = numberFromUnknown(quote.source_total_amount)
    const networkFee = numberFromUnknown(quote.fees?.network_fee_monetary) ?? 0
    const transactionFee = numberFromUnknown(quote.fees?.transaction_fee_monetary) ?? 0
    const feeFiatAmount = networkFee + transactionFee

    const totalFiatAmount =
      sourceTotalAmount ??
      (params.fiatAmount > 0 ? params.fiatAmount + feeFiatAmount : params.fiatAmount)

    return {
      tokenAmount: destinationAmount ?? null,
      totalFiatAmount,
      feeFiatAmount,
      rate:
        destinationAmount && destinationAmount > 0 && totalFiatAmount
          ? totalFiatAmount / destinationAmount
          : null,
      raw: proxyData,
    }
  }

  const secretKey = getEnvValue(STRIPE_SECRET_KEY)
  if (!secretKey) {
    throw new Error(
      'Stripe quote is not configured. Provide VITE_ONRAMP_STRIPE_PROXY_URL for a backend proxy or VITE_ONRAMP_STRIPE_SECRET_KEY (server-side only).'
    )
  }

  return fetchStripeQuoteDirect(params, tokenIdentifier, secretKey)
}

export const fetchQuoteForProvider = async (params: QuoteFetchParams): Promise<QuoteFetchResult> => {
  const tokenIdentifier = resolveTokenIdentifier(params.token)
  if (!tokenIdentifier) {
    throw new Error(`${params.provider.name} does not support ${params.token.symbol ?? 'this token'}`)
  }

  switch (params.provider.id) {
    case 'moonpay':
      return fetchMoonpayQuote(params, tokenIdentifier)
    case 'coinbase':
      return fetchCoinbaseQuote(params, tokenIdentifier)
    case 'stripe':
      return fetchStripeQuote(params, tokenIdentifier)
    default:
      throw new Error(`Unsupported provider: ${params.provider.id}`)
  }
}
