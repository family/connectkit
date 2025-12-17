import { useEffect, useMemo } from 'react'
import { socialProviders, UIAuthProvider } from '../../components/Openfort/types'
import { useOpenfort } from '../../components/Openfort/useOpenfort'
import { useOpenfortCore } from '../../openfort/useOpenfort'
import { OpenfortError, OpenfortReactErrorType } from '../../types'
import { logger } from '../../utils/logger'

export function useProviders() {
  const { user, linkedAccounts } = useOpenfortCore()
  const { uiConfig: options, thirdPartyAuth, setOpen } = useOpenfort()

  const allProviders = options?.authProviders || []
  const providers: UIAuthProvider[] = allProviders.filter((p) => p !== UIAuthProvider.GUEST) || []

  const linkedProviders = user ? providers.filter((p) => linkedAccounts?.find((a) => a.provider === p)) : []
  const availableProviders = user
    ? providers.filter((provider) => {
        if (provider === UIAuthProvider.WALLET) return true // Wallet is always available
        return !linkedAccounts?.find((a) => a.provider === provider)
      })
    : providers

  useEffect(() => {
    if (thirdPartyAuth) {
      setOpen(false)
      logger.error(
        new OpenfortError(
          'When using external third party auth providers, openfort Auth providers are not available. Either remove the `thirdPartyAuth` or authenticate your users using Auth hooks.',
          OpenfortReactErrorType.CONFIGURATION_ERROR
        )
      )
    }
  }, [thirdPartyAuth, setOpen])

  const maxProviders = options?.authProvidersLength || 4

  const { mainProviders, hasExcessProviders, remainingSocialProviders } = useMemo(() => {
    const activeProviders = user ? availableProviders : allProviders

    if (activeProviders.length <= maxProviders) {
      return { mainProviders: activeProviders, hasExcessProviders: false, remainingSocialProviders: [] }
    }

    // Separate social and non-social providers
    const nonSocial = activeProviders.filter((p, _, array) => {
      if (p === UIAuthProvider.EMAIL_OTP && array.includes(UIAuthProvider.EMAIL_PASSWORD)) {
        // If both email otp and email password are present, treat email otp as social to avoid showing both
        return false
      }

      return !socialProviders.includes(p)
    })
    const social = activeProviders.filter((p) => socialProviders.includes(p))

    // Allow as many non-socials as possible, then fill the rest with socials
    const remainingSlots = maxProviders - nonSocial.length
    const remainingSocialProviders = social.slice(Math.max(0, remainingSlots - 1))
    return {
      mainProviders: [...nonSocial, ...social.slice(0, Math.max(0, remainingSlots - 1))].sort((a, b) => {
        // sort them in the original order
        const indexA = activeProviders.indexOf(a)
        const indexB = activeProviders.indexOf(b)
        return indexA - indexB
      }),
      hasExcessProviders: social.length > remainingSlots - 1,
      remainingSocialProviders,
    }
  }, [user, availableProviders, allProviders, maxProviders])

  return {
    availableProviders,
    linkedProviders,
    allProviders,

    mainProviders,
    hasExcessProviders,
    remainingSocialProviders,
  }
}
