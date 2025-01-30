import { OAuthProvider } from "@openfort/openfort-js";
import React from "react";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import Button from "../../Common/Button";
import { PageContent } from "../../Common/Modal/styles";
import { FortOAuthProvider, routes, useFortKit } from "../../FortKit";

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
const AuthProviderButton: React.FC<{ provider: OAuthProvider, title?: string }> = ({ provider, title = provider + " login" }) => {
  const { initOAuth } = useOpenfort();
  const { setRoute, setConnector, log } = useFortKit();
  // const { log } = useFortKit();

  const handleClick = () => {
    setRoute(routes.CONNECT);
    setConnector({ id: provider, type: "oauth" });
  }

  return (
    <Button onClick={handleClick}>{title}</Button>
  )
}

const ProviderButton: React.FC<{ provider: FortOAuthProvider }> = ({ provider }) => {
  switch (provider) {
    case FortOAuthProvider.GUEST:
      return <GuestButton />;
    case FortOAuthProvider.WALLET:
      return <WalletButton />
    case FortOAuthProvider.EMAIL:
      return <EmailButton />
    case FortOAuthProvider.GOOGLE:
      return <AuthProviderButton provider={OAuthProvider.GOOGLE} title="Google Login" />
    case FortOAuthProvider.TWITTER:
      return <AuthProviderButton provider={OAuthProvider.TWITTER} title="Twitter Login" />
    case FortOAuthProvider.DISCORD:
      return <AuthProviderButton provider={OAuthProvider.DISCORD} title="Discord Login" />
    case FortOAuthProvider.EPIC_GAMES:
      return <AuthProviderButton provider={OAuthProvider.EPIC_GAMES} title="Epic games Login" />
    case FortOAuthProvider.FACEBOOK:
      return <AuthProviderButton provider={OAuthProvider.FACEBOOK} title="Facebook Login" />
    // case FortOAuthProvider.TELEGRAM:
    //   return <AuthProviderButton provider={OAuthProvider.TELEGRAM} title="Telegram Login" />
    case FortOAuthProvider.LINE:
      return <AuthProviderButton provider={OAuthProvider.LINE} title="Line Login" />
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
