import { AuthPlayerResponse } from "@openfort/openfort-js";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import FitText from "../../Common/FitText";
import { LinkedProviderButton, LinkedProviderContainer, ProvidersHeader } from "./styles";
import { EmailIcon, FacebookIcon, GoogleIcon, TwitterIcon } from "../../../assets/icons";
import WalletIcon from "../../../assets/wallet";
import { ProviderIcon as ProviderIconContainer } from "../Providers/styles";
import { routes, useFortKit } from "../../FortKit";

const ProviderIcon: React.FC<{ provider: AuthPlayerResponse['linkedAccounts'][0]["provider"] }> = ({ provider }) => {
  switch (provider) {
    case "email":
      return <EmailIcon />;
    case "wallet":
      return <WalletIcon />;
    case "google":
      return <GoogleIcon />;
    case "twitter":
      return <TwitterIcon />;
    case "facebook":
      return <FacebookIcon />;
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

const LinkProviderButton: React.FC = () => {
  const { setRoute } = useFortKit();

  return (
    <LinkedProviderButton
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
        <LinkProviderButton />
      </LinkedProviderContainer>
    </>
  );
}