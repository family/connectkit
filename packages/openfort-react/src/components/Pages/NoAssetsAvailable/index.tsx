import { useChainId } from 'wagmi'
import { BuyIcon, DollarIcon, ReceiveIcon } from '../../../assets/icons'
import { useChains } from '../../../hooks/useChains'
import Button from '../../Common/Button'
import { ModalBody, ModalContent, ModalH1 } from '../../Common/Modal/styles'
import { FloatingGraphic } from '../../FloatingGraphic'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { ButtonsContainer } from './styles'

export const NoAssetsAvailable = () => {
  const { setRoute } = useOpenfort()
  const chainId = useChainId()
  const chains = useChains()
  const chain = chains.find((c) => c.id === chainId)
  const showBuyOption = chain && !chain.testnet

  return (
    <PageContent>
      <FloatingGraphic
        height="190px"
        logoCenter={{
          logo: <BuyIcon />,
        }}
        logoTopLeft={{
          logo: <BuyIcon />,
        }}
        logoBottomRight={{
          logo: <BuyIcon />,
        }}
        logoTopRight={{
          logo: <DollarIcon />,
        }}
        logoBottomLeft={{
          logo: <DollarIcon />,
        }}
      />
      <ModalContent style={{ paddingBottom: 0 }}>
        <ModalH1 $small>No assets available</ModalH1>
        <ModalBody>
          <div style={{ paddingRight: 12, paddingLeft: 12 }}>
            You currently have no assets available in your wallet.
          </div>
          <ButtonsContainer>
            <Button
              onClick={() => {
                setRoute(routes.RECEIVE)
              }}
              icon={<ReceiveIcon />}
            >
              Get assets
            </Button>
            {showBuyOption && (
              <Button
                onClick={() => {
                  setRoute(routes.BUY)
                }}
                icon={<BuyIcon />}
              >
                Buy assets
              </Button>
            )}
          </ButtonsContainer>
        </ModalBody>
      </ModalContent>
    </PageContent>
  )
}
