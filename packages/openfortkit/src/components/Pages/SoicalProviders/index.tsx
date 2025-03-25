import React from "react";
import { useProviders } from "../../../hooks/openfort/useProviders";
import { PageContent } from "../../Common/Modal/styles";
import PoweredByFooter from "../../Common/PoweredByFooter";
import { ScrollArea } from "../../Common/ScrollArea";
import { socialProviders } from "../../OpenfortKit/types";
import { ProviderButtonSwitch } from "../Providers";

const SocialProviders: React.FC = () => {
  const { availableProviders } = useProviders();

  const activeProviders = socialProviders.filter((p) => availableProviders.includes(p));

  return (
    <PageContent>
      <ScrollArea mobileDirection={'horizontal'}>
        {
          (activeProviders).map((auth) => (
            <ProviderButtonSwitch key={auth} provider={auth} />
          ))
        }
      </ScrollArea>
      <PoweredByFooter showDisclaimer={true} />
    </PageContent>
  )
}

export default SocialProviders;
