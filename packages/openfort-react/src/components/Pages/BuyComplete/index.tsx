import { useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { ExternalLinkIcon } from '../../../assets/icons'
import Button from '../../Common/Button'
import { ModalBody, ModalContent, ModalH1 } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { ContinueButtonWrapper, Section } from '../Buy/styles'

const BuyComplete = () => {
  const { setRoute, triggerResize } = useOpenfort()
  const { address } = useAccount()
  const chainId = useChainId()

  // Trigger resize on mount
  useEffect(() => {
    triggerResize()
  }, [triggerResize])

  // Clean up sessionStorage
  useEffect(() => {
    sessionStorage.removeItem('buyPopupOpen')
  }, [])

  const handleDone = () => {
    setRoute(routes.PROFILE)
  }

  const handleBack = () => {
    setRoute(routes.PROFILE)
  }

  const getBlockExplorerUrl = (chainId: number, address: string): string => {
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io',
      8453: 'https://basescan.org',
      137: 'https://polygonscan.com',
      42161: 'https://arbiscan.io',
      10: 'https://optimistic.etherscan.io',
      84532: 'https://sepolia.basescan.org',
    }
    const baseUrl = explorers[chainId] || 'https://basescan.org'
    return `${baseUrl}/address/${address}`
  }

  const blockExplorerUrl = address ? getBlockExplorerUrl(chainId, address) : ''

  return (
    <PageContent onBack={handleBack}>
      <ModalContent style={{ paddingBottom: 18, textAlign: 'center' }}>
        <ModalH1>Provider Finished</ModalH1>

        <ModalBody style={{ marginTop: 24 }}>
          The provider flow has been completed. You can view your wallet on the block explorer to check your
          transactions.
        </ModalBody>

        <Section style={{ marginTop: 24 }}>
          {blockExplorerUrl && (
            <ContinueButtonWrapper style={{ marginTop: 0 }}>
              <Button
                variant="secondary"
                onClick={() => window.open(blockExplorerUrl, '_blank', 'noopener,noreferrer')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>View Wallet Transactions</span>
                  <ExternalLinkIcon />
                </div>
              </Button>
            </ContinueButtonWrapper>
          )}
          <ContinueButtonWrapper style={{ marginTop: blockExplorerUrl ? 4 : 0 }}>
            <Button variant="primary" onClick={handleDone}>
              Done
            </Button>
          </ContinueButtonWrapper>
        </Section>
      </ModalContent>
    </PageContent>
  )
}

export default BuyComplete
