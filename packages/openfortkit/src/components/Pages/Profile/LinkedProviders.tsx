import { AuthPlayerResponse } from "@openfort/openfort-js";
import { EmailIcon } from "../../../assets/icons";
import Logos from "../../../assets/logos";
import { useProviders } from "../../../hooks/openfort/useProviders";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import FitText from "../../Common/FitText";
import { routes, useFortKit } from "../../FortKit";
import { ProviderIcon as ProviderIconContainer } from "../Providers/styles";
import { LinkedProviderButton, LinkedProviderContainer, ProvidersHeader } from "./styles";
import Wallet from "../../../assets/wallet";
import { useMemo } from "react";
import { useWallets } from "../../../wallets/useWallets";

const WalletIcon: React.FC<{ provider: AuthPlayerResponse['linkedAccounts'][0] }> = ({ provider }) => {

  if (provider.walletClientType === "walletconnect") return <Logos.WalletConnect />

  const wallets = useWallets();
  const wallet = useMemo(() => {
    return wallets.find(w => w.name?.toLowerCase() === provider.walletClientType);
  }, [provider])

  if (wallet) return <>{wallet.iconConnector ?? wallet.icon}</>

  return <Wallet />
}


const ProviderIcon: React.FC<{ provider: AuthPlayerResponse['linkedAccounts'][0] }> = ({ provider }) => {
  switch (provider.provider) {
    case "email":
      return <EmailIcon />;
    case "wallet":
      return <WalletIcon provider={provider} />;
    case "google":
      return <Logos.Google />;
    case "twitter":
      return <Logos.Twitter />;
    case "facebook":
      return <Logos.Facebook />;
    default:
      return <FitText>{provider.provider.substring(0, 1).toUpperCase()}</FitText>;
  }
}

const LinkedProvider: React.FC<{ provider: AuthPlayerResponse['linkedAccounts'][0] }> = ({ provider }) => {

  return (
    <LinkedProviderButton
      disabled={true} // TODO: on click, unlink provider
    >
      <ProviderIconContainer>
        <ProviderIcon provider={provider} />
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
          user.linkedAccounts.map((provider, i) => (
            <LinkedProvider key={provider.provider + i} provider={provider} />
          ))
        }
        <AddLinkedProviderButton />
      </LinkedProviderContainer>
    </>
  );
}