import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SendTokenOption } from '../../Openfort/types'
import {
  createEmptyQuote,
  createUnsupportedTokenQuote,
  getProviderById,
  getProviders,
  type ProviderDefinition,
  type ProviderQuote,
} from './providers'
import { fetchQuoteForProvider } from './quoteClients'

type UseBuyQuotesParams = {
  fiatAmount: number | null
  fiatCurrency: string
  token: SendTokenOption
}

type UseBuyQuotesResult = {
  quotes: ProviderQuote[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

const tokenKey = (token: SendTokenOption) => {
  if (token.type === 'erc20') {
    if ('address' in token && token.address) return `${token.type}:${token.address.toLowerCase()}`
    if (token.symbol) return `${token.type}:${token.symbol.toUpperCase()}`
    return token.type
  }

  return `${token.type}:${token.symbol?.toUpperCase() ?? ''}:${token.decimals ?? ''}`
}

const makeDefaultQuotes = (providers: ProviderDefinition[]): ProviderQuote[] =>
  providers.map((provider) => createEmptyQuote(provider))

export const useBuyQuotes = ({ fiatAmount, fiatCurrency, token }: UseBuyQuotesParams): UseBuyQuotesResult => {
  const providers = useMemo(() => getProviders(), [])
  const tokenSignature = useMemo(() => tokenKey(token), [token])
  const [quotes, setQuotes] = useState<ProviderQuote[]>(() => makeDefaultQuotes(providers))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshIndex, setRefreshIndex] = useState(0)

  const refetch = useCallback(() => {
    setRefreshIndex((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (fiatAmount === null || Number.isNaN(fiatAmount) || fiatAmount <= 0) {
      setQuotes(makeDefaultQuotes(providers))
      setError(null)
      setIsLoading(false)
      return
    }

    let isMounted = true
    const controller = new AbortController()

    const loadQuotes = async () => {
      setIsLoading(true)
      setError(null)

      const results: ProviderQuote[] = await Promise.all(
        providers.map(async (provider) => {
          try {
            const quoteData = await fetchQuoteForProvider({
              provider,
              fiatAmount,
              fiatCurrency,
              token,
              signal: controller.signal,
            })

            return {
              provider,
              tokenAmount: quoteData.tokenAmount,
              totalFiatAmount: quoteData.totalFiatAmount,
              feeFiatAmount: quoteData.feeFiatAmount,
              rate: quoteData.rate,
              raw: quoteData.raw,
            }
          } catch (caughtError) {
            if (controller.signal.aborted) {
              return createEmptyQuote(provider)
            }

            const message = caughtError instanceof Error ? caughtError.message : 'Unable to fetch quote'

            if (message.toLowerCase().includes('does not support')) {
              return createUnsupportedTokenQuote(provider, token)
            }

            return {
              ...createEmptyQuote(provider),
              error: message,
            }
          }
        })
      )

      if (!isMounted || controller.signal.aborted) return

      setQuotes(results)
      setIsLoading(false)

      const allFailed = results.every((quote) => quote.error)
      setError(allFailed ? results[0]?.error ?? 'Unable to fetch quotes' : null)
    }

    void loadQuotes()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [fiatAmount, fiatCurrency, tokenSignature, providers, refreshIndex, token])

  return useMemo(
    () => ({
      quotes,
      isLoading,
      error,
      refetch,
    }),
    [quotes, isLoading, error, refetch]
  )
}

export const getQuoteForProvider = (quotes: ProviderQuote[], providerId: string) => {
  const provider = getProviderById(providerId as ProviderDefinition['id'])
  const matched = quotes.find((quote) => quote.provider.id === provider.id)
  return matched ?? createEmptyQuote(provider)
}
