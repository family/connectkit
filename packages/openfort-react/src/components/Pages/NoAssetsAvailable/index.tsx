import { useChainId } from 'wagmi'
import { BuyIcon, DollarIcon } from '../../../assets/icons'
import { useChains } from '../../../hooks/useChains'
import Button from '../../Common/Button'
import { ModalBody, ModalContent, ModalH1 } from '../../Common/Modal/styles'
import { FloatingGraphic } from '../../FloatingGraphic'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'

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
          <div style={{ paddingRight: 6, paddingLeft: 6 }}>You currently have no assets available in your wallet.</div>
          {showBuyOption && (
            <Button
              onClick={() => {
                setRoute(routes.BUY)
              }}
              icon={<BuyIcon />}
              style={{ marginTop: 12 }}
            >
              Buy assets
            </Button>
          )}
        </ModalBody>
      </ModalContent>
    </PageContent>
  )
}
