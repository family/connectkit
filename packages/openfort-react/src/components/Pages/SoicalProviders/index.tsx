import type React from 'react'
import { useProviders } from '../../../hooks/openfort/useProviders'
import { PageContent } from '../../Common/Modal/styles'
import PoweredByFooter from '../../Common/PoweredByFooter'
import { ScrollArea } from '../../Common/ScrollArea'
import { ProviderButtonSwitch } from '../Providers'

const SocialProviders: React.FC = () => {
  const { remainingSocialProviders } = useProviders()

  return (
    <PageContent>
      <ScrollArea mobileDirection={'horizontal'}>
        {remainingSocialProviders.map((auth) => (
          <ProviderButtonSwitch key={auth} provider={auth} />
        ))}
      </ScrollArea>
      <PoweredByFooter showDisclaimer={true} />
    </PageContent>
  )
}

export default SocialProviders
