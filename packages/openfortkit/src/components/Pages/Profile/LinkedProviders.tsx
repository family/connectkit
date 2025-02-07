import { AuthPlayerResponse } from "@openfort/openfort-js";
import { EmailIcon } from "../../../assets/icons";
import Logos from "../../../assets/logos";
import { useProviders } from "../../../hooks/openfort/useProviders";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import FitText from "../../Common/FitText";
import { routes, useFortKit } from "../../FortKit";
import { ProviderIcon as ProviderIconContainer } from "../Providers/styles";
import { LinkedProviderButton, LinkedProviderContainer, ProvidersHeader } from "./styles";

const ProviderIcon: React.FC<{ provider: AuthPlayerResponse['linkedAccounts'][0]["provider"] }> = ({ provider }) => {
  switch (provider) {
    case "email":
      return <EmailIcon />;
    case "wallet":
      return <Logos.WalletConnect />;
    case "google":
      return <Logos.Google />;
    case "twitter":
      return <Logos.Twitter />;
    case "facebook":
      return <Logos.Facebook />;
    default:
      return <FitText>{provider.substring(0, 1).toUpperCase()}</FitText>;
  }
}

const LinkedProvider: React.FC<{ provider: AuthPlayerResponse['linkedAccounts'][0] }> = ({ provider }) => {

  return (
    <LinkedProviderButton
      disabled={true} // TODO: on click, unlink provider
    >
      <ProviderIconContainer>
        <ProviderIcon provider={provider.provider} />
      </ProviderIconContainer>
    </LinkedProviderButton>
  )
}

const AddLinkedProviderButton: React.FC = () => {
  const { setRoute } = useFortKit();
  const { availableProviders: unlinkedProviders } = useProviders();

  return (
    <LinkedProviderButton
      disabled={unlinkedProviders.length === 0}
      onClick={() => setRoute(routes.PROVIDERS)}
    >
      +
    </LinkedProviderButton>
  )
}


export const LinkedProviders: React.FC = () => {
  const { user } = useOpenfort();

  if (!user || !user.linkedAccounts) {
    return (
      <div>
        <p>No linked providers</p>
      </div>
    );
  }

  return (
    <>
      <ProvidersHeader>
        Linked providers
      </ProvidersHeader>
      <LinkedProviderContainer>
        {
          user.linkedAccounts.map((provider) => (
            <LinkedProvider key={provider.provider} provider={provider} />
          ))
        }
        <AddLinkedProviderButton />
      </LinkedProviderContainer>
    </>
  );
}