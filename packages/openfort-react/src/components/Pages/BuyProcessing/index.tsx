import { useEffect, useMemo, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import Logos from '../../../assets/logos'
import { useTokens } from '../../../hooks/useTokens'
import Button from '../../Common/Button'
import { ModalBody, ModalContent, ModalHeading } from '../../Common/Modal/styles'
import SquircleSpinner from '../../Common/SquircleSpinner'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { createCoinbaseSession } from '../Buy/coinbaseApi'
import { createStripeSession } from '../Buy/stripeApi'
import { ContinueButtonWrapper, PendingContainer, StackedButtonWrapper } from '../Buy/styles'
import { isSameToken } from '../Send/utils'

const BuyProcessing = () => {
  const { buyForm, setRoute, triggerResize, publishableKey } = useOpenfort()
  const { tokenOptions } = useTokens()
  const { address } = useAccount()
  const chainId = useChainId()
  const [popupWindow, setPopupWindow] = useState<Window | null>(null)
  const [showContinueButton, setShowContinueButton] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(true)
  const [sessionError, setSessionError] = useState(false)

  const matchedToken = useMemo(
    () => tokenOptions.find((token) => isSameToken(token, buyForm.token)),
    [tokenOptions, buyForm.token]
  )

  const selectedTokenOption = matchedToken ?? tokenOptions[0]
  const selectedToken = selectedTokenOption ?? buyForm.token

  const fiatAmount = useMemo(() => {
    const normalized = buyForm.amount
    if (!normalized) return null
    const numeric = Number(normalized)
    if (!Number.isFinite(numeric)) return null
    return numeric
  }, [buyForm.amount])

  // Create session and open popup on mount
  useEffect(() => {
    const createSessionAndOpenPopup = async () => {
      if (!address || !fiatAmount || fiatAmount <= 0) {
        setRoute(routes.BUY_SELECT_PROVIDER)
        return
      }

      setIsCreatingSession(true)
      setSessionError(false)

      try {
        let onrampUrl: string | null = null

        // Create session based on selected provider
        if (buyForm.providerId === 'coinbase') {
          const session = await createCoinbaseSession({
            token: selectedToken,
            chainId,
            publishableKey,
            destinationAddress: address,
            sourceAmount: fiatAmount.toFixed(2),
            sourceCurrency: buyForm.currency,
            redirectUrl: `${window.location.origin}?coinbase_onramp=success`,
          })
          onrampUrl = session.onrampUrl
        } else if (buyForm.providerId === 'stripe') {
          const session = await createStripeSession({
            token: selectedToken,
            chainId,
            publishableKey,
            destinationAddress: address,
            sourceAmount: fiatAmount.toFixed(2),
            sourceCurrency: buyForm.currency,
            redirectUrl: `${window.location.origin}?stripe_onramp=success`,
          })
          onrampUrl = session.onrampUrl
        }

        if (!onrampUrl) {
          setSessionError(true)
          return
        }

        // TODO: remove this? it fails if is set to EUR in coinbase
        const url = new URL(onrampUrl)
        url.searchParams.delete('fiatCurrency')
        const sanitizedProviderUrl = url.toString()

        if (typeof window !== 'undefined') {
          const popupWidth = 500
          const popupHeight = 700
          const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX
          const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY
          const width = window.innerWidth
            ? window.innerWidth
            : document.documentElement.clientWidth
              ? document.documentElement.clientWidth
              : screen.width
          const height = window.innerHeight
            ? window.innerHeight
            : document.documentElement.clientHeight
              ? document.documentElement.clientHeight
              : screen.height
          const left = width / 2 - popupWidth / 2 + dualScreenLeft
          const top = height / 2 - popupHeight / 2 + dualScreenTop

          const popup = window.open(
            sanitizedProviderUrl,
            'BuyPopup',
            `scrollbars=yes,width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
          )

          if (popup) {
            setPopupWindow(popup)
          } else {
            setSessionError(true)
          }
        }
      } catch (_error) {
        setSessionError(true)
      } finally {
        setIsCreatingSession(false)
      }
    }

    createSessionAndOpenPopup()
  }, []) // Only run once on mount

  // Trigger resize on mount and when state changes
  useEffect(() => {
    triggerResize()
  }, [triggerResize, isCreatingSession, showContinueButton, sessionError])

  // Show continue button after 2 seconds
  useEffect(() => {
    if (isCreatingSession) return

    setShowContinueButton(false)
    const timer = setTimeout(() => {
      setShowContinueButton(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [isCreatingSession])

  // Monitor popup window for redirect or close
  useEffect(() => {
    if (!popupWindow || isCreatingSession) return

    const checkPopup = setInterval(() => {
      try {
        // Check if popup is closed
        if (popupWindow.closed) {
          clearInterval(checkPopup)
          setPopupWindow(null)
          // Only auto-advance for Coinbase
          if (buyForm.providerId === 'coinbase') {
            setRoute(routes.BUY_COMPLETE)
          }
          return
        }

        // Try to check if popup has redirected to our success URL
        try {
          const popupUrl = popupWindow.location.href
          if (popupUrl.includes('coinbase_onramp=success') || popupUrl.includes('stripe_onramp=success')) {
            popupWindow.close()
            setPopupWindow(null)
            setRoute(routes.BUY_COMPLETE)
            clearInterval(checkPopup)
          }
        } catch (_e) {
          // Cross-origin error is expected while on provider domain
          // We can't read the URL until it redirects back to our domain
        }
      } catch (_error) {
        // Handle any other errors
        clearInterval(checkPopup)
      }
    }, 500)

    return () => {
      clearInterval(checkPopup)
    }
  }, [popupWindow, buyForm.providerId, setRoute, isCreatingSession])

  const handleCancel = () => {
    if (popupWindow && !popupWindow.closed) {
      popupWindow.close()
    }
    setPopupWindow(null)
    setRoute(routes.BUY)
  }

  const handleContinue = () => {
    if (popupWindow && !popupWindow.closed) {
      popupWindow.close()
    }
    setPopupWindow(null)
    setRoute(routes.BUY_COMPLETE)
  }

  const handleBack = () => {
    if (popupWindow && !popupWindow.closed) {
      popupWindow.close()
    }
    setPopupWindow(null)
    setRoute(routes.BUY_SELECT_PROVIDER)
  }

  if (sessionError) {
    return (
      <PageContent onBack={handleBack}>
        <ModalContent style={{ paddingBottom: 18, textAlign: 'center' }}>
          <ModalHeading>Error</ModalHeading>
          <ModalBody>
            Failed to create payment session.
            <br />
            Please try again.
          </ModalBody>
          <ContinueButtonWrapper style={{ marginTop: 24 }}>
            <Button variant="primary" onClick={handleBack}>
              Go Back
            </Button>
          </ContinueButtonWrapper>
        </ModalContent>
      </PageContent>
    )
  }

  if (isCreatingSession) {
    return (
      <PageContent onBack={handleBack}>
        <ModalContent style={{ paddingBottom: 18, textAlign: 'center' }}>
          <ModalHeading>Creating Session</ModalHeading>
          <ModalBody>Please wait...</ModalBody>
          <PendingContainer>
            <SquircleSpinner
              logo={
                <div
                  style={{
                    padding: '12px',
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Logos.Openfort />
                </div>
              }
              connecting={true}
            />
          </PendingContainer>
        </ModalContent>
      </PageContent>
    )
  }

  const isStripe = buyForm.providerId === 'stripe'
  const isCoinbase = buyForm.providerId === 'coinbase'

  return (
    <PageContent onBack={handleCancel}>
      <ModalContent style={{ paddingBottom: 18, textAlign: 'center' }}>
        <ModalHeading>Processing Purchase</ModalHeading>
        <ModalBody>Complete the purchase in the popup window...</ModalBody>

        <PendingContainer>
          <SquircleSpinner
            logo={
              <div
                style={{
                  padding: '12px',
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isStripe && <Logos.Stripe />}
                {isCoinbase && <Logos.CoinbasePay />}
                {!isStripe && !isCoinbase && <Logos.Openfort />}
              </div>
            }
            connecting={true}
          />
        </PendingContainer>

        {showContinueButton && <ModalBody>Click Continue when you are done.</ModalBody>}

        {showContinueButton && (
          <>
            <StackedButtonWrapper>
              <Button variant="primary" onClick={handleContinue}>
                Continue
              </Button>
            </StackedButtonWrapper>
            <StackedButtonWrapper>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </StackedButtonWrapper>
          </>
        )}
      </ModalContent>
    </PageContent>
  )
}

export default BuyProcessing
