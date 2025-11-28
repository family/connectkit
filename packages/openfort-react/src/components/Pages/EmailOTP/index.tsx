import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EmailIcon } from '../../../assets/icons'
import { useEmailOtpAuth } from '../../../hooks/openfort/auth/useEmailOtpAuth'
import { logger } from '../../../utils/logger'
import { ModalBody, ModalHeading } from '../../Common/Modal/styles'
import { OtpInputStandalone } from '../../Common/OTPInput'
import PoweredByFooter from '../../Common/PoweredByFooter'
import { FloatingGraphic } from '../../FloatingGraphic'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent, type SetOnBackFunction } from '../../PageContent'
import { Body, FooterButtonText, FooterTextButton, ResultContainer } from './styles'

// TODO: Localize

type Status = 'idle' | 'error' | 'success' | 'loading' | 'send-otp' | 'sending-otp'

const RESEND_COOLDOWN_MS = 10000
const SUCCESS_REDIRECT_DELAY_MS = 2000
const ERROR_DISPLAY_DURATION_MS = 2000

const EmailOTP: React.FC = () => {
  const { emailInput: email, previousRoute, setRoute, setEmailInput } = useOpenfort()
  const { isLoading, requestEmailOtp, logInWithEmailOtp } = useEmailOtpAuth({
    recoverWalletAutomatically: false,
  })

  const onBack = useMemo<SetOnBackFunction>(() => {
    if (previousRoute?.route === routes.EMAIL_VERIFICATION) return routes.PROVIDERS
    return 'back'
  }, [previousRoute])

  const [canSendOtp, setCanSendOtp] = useState(true)
  const [status, setStatus] = useState<Status>('idle')

  // Single ref to track if initial OTP request has been made
  const hasRequestedInitialOtpRef = useRef(false)

  // Memoize the OTP request function to prevent unnecessary recreations
  const sendOtpRequest = useCallback(async () => {
    const { error } = await requestEmailOtp({ email })

    if (error) {
      setStatus('error')
    } else {
      setStatus('idle')
    }
  }, [email, requestEmailOtp])

  // Initial OTP request on mount
  useEffect(() => {
    if (hasRequestedInitialOtpRef.current) return
    hasRequestedInitialOtpRef.current = true

    sendOtpRequest()
  }, [sendOtpRequest])

  // Handle OTP completion
  const handleComplete = useCallback(
    async (otp: string) => {
      logger.log('OTP entered:', otp)
      setStatus('loading')

      const { error } = await logInWithEmailOtp({ email, otp })

      if (error) {
        setStatus('error')
      } else {
        setStatus('success')
      }
    },
    [email, logInWithEmailOtp]
  )

  // Handle status changes and side effects
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined

    switch (status) {
      case 'send-otp':
        setStatus('sending-otp')
        sendOtpRequest()
        break

      case 'success':
        timeoutId = setTimeout(() => {
          setEmailInput('')
          setRoute(routes.LOAD_WALLETS)
        }, SUCCESS_REDIRECT_DELAY_MS)
        break

      case 'error':
        timeoutId = setTimeout(() => {
          setStatus('idle')
        }, ERROR_DISPLAY_DURATION_MS)
        break
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [status, sendOtpRequest, setEmailInput, setRoute])

  // Handle resend cooldown
  useEffect(() => {
    if (canSendOtp) return

    const timerId = setTimeout(() => {
      setCanSendOtp(true)
    }, RESEND_COOLDOWN_MS)

    return () => clearTimeout(timerId)
  }, [canSendOtp])

  // Memoize button text to avoid recalculation
  const sendButtonText = useMemo(() => {
    if (!canSendOtp) return 'Code Sent!'
    if (status === 'sending-otp') return 'Sending...'
    return 'Resend Code'
  }, [canSendOtp, status])

  const handleResendClick = useCallback(() => {
    setStatus('send-otp')
    setCanSendOtp(false)
  }, [])

  const isResendDisabled = !canSendOtp || status === 'sending-otp' || status === 'send-otp'

  return (
    <PageContent onBack={onBack}>
      <ModalHeading>Enter your code</ModalHeading>

      <FloatingGraphic
        height="100px"
        marginTop="8px"
        marginBottom="10px"
        logoCenter={{
          logo: <EmailIcon />,
        }}
      />
      <ModalBody>
        <Body>
          Please check <b>{email}</b> for an email from openfort.io and enter your code below.
        </Body>
        <OtpInputStandalone
          onComplete={handleComplete}
          isLoading={status === 'loading' || isLoading}
          isError={status === 'error'}
          isSuccess={status === 'success'}
        />
        <ResultContainer>
          {status === 'success' && <ModalBody $valid>Code verified successfully!</ModalBody>}
          {status === 'error' && <ModalBody $error>Invalid code. Please try again.</ModalBody>}
        </ResultContainer>
        <FooterTextButton>
          Didn't receive the code?{' '}
          <FooterButtonText type="button" onClick={handleResendClick} disabled={isResendDisabled}>
            {sendButtonText}
          </FooterButtonText>
        </FooterTextButton>
      </ModalBody>
      <PoweredByFooter />
    </PageContent>
  )
}

export default EmailOTP
