import React from "react";
import { PageContent } from "../../Common/Modal/styles";
import { FortOAuthProvider, routes, useContext } from "../../FortKit";
import ConnectorList from "../../Common/ConnectorList";
import Button from "../../Common/Button";
import { useOpenfort } from "../../../openfort/OpenfortProvider";

const GuestButton: React.FC = () => {
  const { signUpGuest } = useOpenfort();

  return (
    <Button onClick={signUpGuest}>Guest login</Button>
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
  const { options, setRoute } = useContext();

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
