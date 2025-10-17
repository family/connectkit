import type React from 'react'
import useIsMobile from '../../../hooks/useIsMobile'
import useLocales from '../../../hooks/useLocales'
import Button from '../../Common/Button'
import ConnectorList from '../../Common/ConnectorList'
import { ModalBody, ModalContent, ModalH1, PageContent } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { InfoBox, InfoBoxButtons } from './styles'

const Wallets: React.FC = () => {
  const context = useOpenfort()
  const locales = useLocales({})

  const isMobile = useIsMobile()

  return (
    <PageContent style={{ width: 312 }}>
      <ConnectorList />
      {isMobile && (
        <InfoBox>
            <ModalContent style={{ padding: 0, textAlign: 'left' }}>
              <ModalH1 $small>{locales.connectorsScreen_h1}</ModalH1>
              <ModalBody>{locales.connectorsScreen_p}</ModalBody>
            </ModalContent>
            <InfoBoxButtons>
              {!context.uiConfig?.hideQuestionMarkCTA && (
                <Button
                  variant={'tertiary'}
                  onClick={() => context.setRoute(routes.ABOUT)}
                >
                  {locales.learnMore}
                </Button>
              )}
              {!context.uiConfig?.hideNoWalletCTA && (
                <Button
                  variant={'tertiary'}
                  onClick={() => context.setRoute(routes.ONBOARDING)}
                >
                  {locales.getWallet}
                </Button>
              )}
            </InfoBoxButtons>
          </InfoBox>
      )}
      {/* {context.options?.disclaimer && (
        <Disclaimer style={{ visibility: 'hidden', pointerEvents: 'none' }}>
          <div>{context.options?.disclaimer}</div>
        </Disclaimer>
      )} */}
    </PageContent>
  );
}

export default Wallets
