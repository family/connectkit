import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [status, setStatus] = useState<'idle' | 'error' | 'success' | 'loading' | 'send-otp' | 'sending-otp'>('idle')

  const handleComplete = async (otp: string) => {
    logger.log('OTP entered:', otp)
    setStatus('loading')

    const { error } = await logInWithEmailOtp({ email, otp })

    if (error) {
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  const [shouldRequestOtp, setShouldRequestOtp] = useState(true)
  const hasRequestedRef = useRef(false)

  useEffect(() => {
    if (!shouldRequestOtp || hasRequestedRef.current) return
    hasRequestedRef.current = true

    const run = async () => {
      const { error } = await requestEmailOtp({ email })

      if (error) setStatus('error')
      else {
        setStatus('idle')
      }

      setShouldRequestOtp(false)
    }

    run()
  }, [shouldRequestOtp, email])

  useEffect(() => {
    if (status === 'send-otp') {
      setStatus('sending-otp')
      setShouldRequestOtp(true)
      hasRequestedRef.current = false
    }
    if (status === 'success') {
      setTimeout(() => {
        setEmailInput('')
        setRoute(routes.LOAD_WALLETS)
      }, 2000)
    }
    if (status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const sendButtonText = () => {
    if (!canSendOtp) return 'Code Sent!'
    if (status === 'sending-otp') return 'Sending...'
    if (status === 'send-otp') return 'Resend Code'
    return 'Resend Code'
  }

  useEffect(() => {
    if (!canSendOtp) {
      const timer = setTimeout(() => {
        setCanSendOtp(true)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [canSendOtp])

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
          <FooterButtonText
            type="button"
            onClick={() => {
              setStatus('send-otp')
              setCanSendOtp(false)
            }}
            disabled={!canSendOtp || status === 'sending-otp' || status === 'send-otp'}
          >
            {sendButtonText()}
          </FooterButtonText>
        </FooterTextButton>
      </ModalBody>
      <PoweredByFooter />
    </PageContent>
  )
}

export default EmailOTP
