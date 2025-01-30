import React from "react";
import { PageContent } from "../../Common/Modal/styles";
import { FortOAuthProvider, routes, useFortKit } from "../../FortKit";
import ConnectorList from "../../Common/ConnectorList";
import Button from "../../Common/Button";
import { useOpenfort } from "../../../openfort/OpenfortProvider";

const GuestButton: React.FC = () => {
  const { signUpGuest } = useOpenfort();
  const { setRoute } = useFortKit();

  const handleClick = () => {
    signUpGuest();
    setRoute(routes.RECOVER);
  }

  return (
    <Button onClick={handleClick}>Guest login</Button>
  )
}

const WalletButton: React.FC = () => {
  const { setRoute } = useFortKit();
  return <Button onClick={() => setRoute(routes.CONNECTORS)}>NOT IMPLEMENTED: Wallet</Button>
}

const EmailButton: React.FC = () => {
  const { setRoute } = useFortKit();
  return <Button onClick={() => setRoute(routes.EMAIL_LOGIN)}>Email</Button>
}

const ProviderButton: React.FC<{ provider: FortOAuthProvider }> = ({ provider }) => {
  switch (provider) {
    case FortOAuthProvider.GUEST:
      return <GuestButton />;
    case FortOAuthProvider.WALLET:
      return <WalletButton />
    case FortOAuthProvider.EMAIL:
      return <EmailButton />
    default:
      return <Button>NOT IMPLEMENTED: {provider}</Button>;
  }
}


const OpenfortLogin: React.FC = () => {
  const { options, setRoute } = useFortKit();

  return (
    <PageContent>
      enabled providers: [{options?.authProviders?.toString()}]
      {
        options?.authProviders?.map((auth) => (
          <ProviderButton key={auth} provider={auth} />
        ))
      }


    </PageContent>
  )
}

export default OpenfortLogin;
