import type React from 'react'
import { useProviders } from '../../../hooks/openfort/useProviders'
import PoweredByFooter from '../../Common/PoweredByFooter'
import { ScrollArea } from '../../Common/ScrollArea'
import { PageContent } from '../../PageContent'
import { ProviderButton } from '../Providers'

const SocialProviders: React.FC = () => {
  const { remainingSocialProviders } = useProviders()

  return (
    <PageContent>
      <ScrollArea mobileDirection={'horizontal'}>
        {remainingSocialProviders.map((auth) => (
          <ProviderButton key={auth} provider={auth} />
        ))}
      </ScrollArea>
      <PoweredByFooter showDisclaimer={true} />
    </PageContent>
  )
}

export default SocialProviders
