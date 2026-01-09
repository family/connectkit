import type { OAuthProvider } from '@openfort/openfort-js'
import { useEffect, useMemo, useState } from 'react'
import type { Hex } from 'viem'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import styled from '../../../styles/styled'
import { logger } from '../../../utils/logger'
import Button from '../../Common/Button'
import { CopyText } from '../../Common/CopyToClipboard/CopyText'
import { ModalBody, ModalContent, ModalH1, ModalHeading } from '../../Common/Modal/styles'
import { getProviderName } from '../../Common/Providers/getProviderName'
import { WalletDisplay } from '../../Common/Providers/ProviderHeader'
import { ProviderIcon } from '../../Common/Providers/ProviderIcon'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'

const ProviderIconContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ProviderIconWrapper = styled.div`
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ck-body-background-secondary);
  border-radius: 28px;
`
const ProviderIconInner = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`

const ErrorMessage = styled.div`
  color: var(--ck-body-color-danger, #ff4d4f);
  margin-top: 16px;
`

const RemoveLinkedProvider: React.FC = () => {
  const { route, triggerResize, onBack, setOnBack, setRouteHistory, setRoute } = useOpenfort()
  const { client, updateUser } = useOpenfortCore()
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const provider = useMemo(() => {
    if (route.route === 'removeLinkedProvider') {
      return route.provider
    }
    throw new Error('No provider found in route')
  }, [])

  useEffect(() => {
    if (error) triggerResize()
  }, [error])

  useEffect(() => {
    if (isSuccess) {
      updateUser()
      triggerResize()
      setOnBack(() => () => {
        setRouteHistory((prev) => {
          const newHistory = [...prev]
          newHistory.pop()
          newHistory.pop()
          if (newHistory.length > 0) {
            setRoute(newHistory[newHistory.length - 1])
          } else {
            setRoute({ route: routes.CONNECTED })
          }
          return newHistory
        })
      })
    }
  }, [isSuccess])

  const handleRemove = async () => {
    if (provider.provider === 'siwe' || provider.provider === 'wallet')
      try {
        const result = await client.auth.unlinkWallet({
          address: provider.accountId as Hex,
          chainId: provider.chainId!,
        })
        if (!result.success) {
          setError('Failed to remove linked provider. Please try again.')
          return
        } else {
          setIsSuccess(true)
        }
      } catch (e) {
        if (e instanceof Error) setError(e.message)
        else {
          logger.error('Unexpected error removing linked provider:', e)
          setError('Failed to remove linked provider. Please try again.')
        }
        return
      }
    else {
      try {
        const result = await client.auth.unlinkOAuth({
          provider: provider.provider as OAuthProvider,
        })
        if (!result.status) {
          setError('Failed to remove linked provider. Please try again.')
          return
        } else {
          setIsSuccess(true)
        }
      } catch (e) {
        if (e instanceof Error) setError(e.message)
        else {
          logger.error('Unexpected error removing linked provider:', e)
          setError('Failed to remove linked provider. Please try again.')
        }
        return
      }
    }
  }

  return (
    <PageContent>
      <ModalHeading>Remove {getProviderName(provider.provider)}</ModalHeading>
      <ModalContent style={{ paddingBottom: 0 }}>
        <ProviderIconContainer style={{ marginBottom: '16px' }}>
          <ProviderIconWrapper>
            <ProviderIconInner>
              <ProviderIcon provider={provider} />
            </ProviderIconInner>
          </ProviderIconWrapper>
        </ProviderIconContainer>
        {isSuccess ? (
          <>
            <ModalH1 $valid>Success</ModalH1>
            <ModalBody>
              Successfully removed{' '}
              {provider.provider === 'siwe' ? (
                <span>
                  <b>
                    <WalletDisplay walletAddress={provider.accountId!} />
                  </b>
                  .
                </span>
              ) : (
                <>
                  <b>{getProviderName(provider.provider)}</b> as an authentication method.
                </>
              )}
            </ModalBody>
            <ButtonWrapper style={{ marginTop: 0 }}>
              <Button onClick={() => onBack?.()}>Back</Button>
            </ButtonWrapper>
          </>
        ) : (
          <>
            <p>
              Are you sure you want to remove{' '}
              {provider.provider === 'siwe' ? (
                <CopyText value={provider.accountId!}>
                  <b>
                    <WalletDisplay walletAddress={provider.accountId!} />
                  </b>
                  ?
                </CopyText>
              ) : (
                <>
                  <b>{getProviderName(provider.provider)}</b>as an authentication method?
                </>
              )}
            </p>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ButtonWrapper style={{ marginTop: 0 }}>
              <Button onClick={() => onBack?.()}>Cancel</Button>
              <Button onClick={handleRemove}>Remove</Button>
            </ButtonWrapper>
          </>
        )}
      </ModalContent>
    </PageContent>
  )
}

export default RemoveLinkedProvider
