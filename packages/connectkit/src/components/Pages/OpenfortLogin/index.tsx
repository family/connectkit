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
    setRoute(routes.SETUP_EMBEDDED_SIGNER);
  }

  return (
    <Button onClick={handleClick}>Guest login</Button>
  )
}

const ProviderButton: React.FC<{ provider: FortOAuthProvider }> = ({ provider }) => {
  switch (provider) {
    case FortOAuthProvider.GUEST:
      return <GuestButton />;
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

      <Button onClick={() => setRoute(routes.CONNECTORS)}>Wallet</Button>

    </PageContent>
  )
}

export default OpenfortLogin;
