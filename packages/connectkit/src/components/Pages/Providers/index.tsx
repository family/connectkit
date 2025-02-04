import { OAuthProvider } from "@openfort/openfort-js";
import React, { useEffect } from "react";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import Button from "../../Common/Button";
import { PageContent } from "../../Common/Modal/styles";
import { FortOAuthProvider, routes, useFortKit } from "../../FortKit";
import { EmailIcon, FacebookIcon, GoogleIcon, GuestIcon, TwitterIcon, } from "../../../assets/icons";
import { ScrollArea } from "../../Common/ScrollArea";
import { ProviderIcon, ProviderLabel, ProvidersButton as ProvidersButtonStyle } from "./styles";
import WalletIcon from "../../../assets/wallet";
import PoweredByFooter from "../../Common/PoweredByFooter";

const ProviderButton: React.FC<{
  onClick: () => void;
  icon?: React.ReactNode
  children?: React.ReactNode;
}> = ({
  children,
  icon,
  onClick
}) => {
    return (
      <ProvidersButtonStyle>
        <Button
          onClick={onClick}
        >
          <ProviderLabel>{children}</ProviderLabel>
          <ProviderIcon>
            {icon}
          </ProviderIcon>
        </Button>
      </ProvidersButtonStyle>
    )
  }

const GuestButton: React.FC = () => {
  const { signUpGuest } = useOpenfort();
  const { setRoute } = useFortKit();

  const handleClick = () => {
    signUpGuest();
    setRoute(routes.RECOVER);
  }

  return (
    <ProviderButton
      onClick={handleClick}
      icon={<GuestIcon />}
    >
      Guest
    </ProviderButton>
  )
}

const WalletButton: React.FC = () => {
  const { setRoute } = useFortKit();
  return <ProviderButton
    onClick={() => setRoute(routes.CONNECTORS)}
    icon={<WalletIcon />}
  >
    Wallet
  </ProviderButton>
}

const EmailButton: React.FC = () => {
  const { setRoute } = useFortKit();
  const { user } = useOpenfort();

  return <ProviderButton
    onClick={() => setRoute(user ? routes.LINK_EMAIL : routes.EMAIL_LOGIN)}
    icon={<EmailIcon />}
  >
    Email
  </ProviderButton>
}

const AuthProviderButton: React.FC<{ provider: OAuthProvider, title?: string, icon?: React.ReactNode }> = ({ provider, title = provider + " login", icon }) => {
  const { setRoute, setConnector } = useFortKit();

  const handleClick = () => {
    setRoute(routes.CONNECT);
    setConnector({ id: provider, type: "oauth" });
  }

  return (
    <ProviderButton
      onClick={handleClick}
      icon={icon}
    >
      {title}
    </ProviderButton>
  )
}

const ProviderButtonSwitch: React.FC<{ provider: FortOAuthProvider }> = ({ provider }) => {
  switch (provider) {
    case FortOAuthProvider.GUEST:
      return <GuestButton />;
    case FortOAuthProvider.WALLET:
      return <WalletButton />
    case FortOAuthProvider.EMAIL:
      return <EmailButton />
    case FortOAuthProvider.GOOGLE:
      return (
        <AuthProviderButton
          provider={OAuthProvider.GOOGLE}
          title="Google"
          icon={<GoogleIcon />}
        />
      )
    case FortOAuthProvider.TWITTER:
      return (
        <AuthProviderButton
          provider={OAuthProvider.TWITTER}
          title="Twitter"
          icon={<TwitterIcon />}
        />
      )
    case FortOAuthProvider.FACEBOOK:
      return (
        <AuthProviderButton
          provider={OAuthProvider.FACEBOOK}
          title="Facebook"
          icon={<FacebookIcon />}
        />
      )
    // case FortOAuthProvider.DISCORD:
    //   return <AuthProviderButton provider={OAuthProvider.DISCORD} title="Discord" />
    // case FortOAuthProvider.EPIC_GAMES:
    //   return <AuthProviderButton provider={OAuthProvider.EPIC_GAMES} title="Epic games" />
    // case FortOAuthProvider.TELEGRAM:
    //   return <AuthProviderButton provider={OAuthProvider.TELEGRAM} title="Telegram" />
    // case FortOAuthProvider.LINE:
    //   return <AuthProviderButton provider={OAuthProvider.LINE} title="Line" />
    default:
      return <Button>NOT IMPLEMENTED: {provider}</Button>;
  }
}


const Providers: React.FC = () => {
  const { options } = useFortKit();
  const { user } = useOpenfort();

  const providers = options?.authProviders ?? [
    FortOAuthProvider.GUEST,
    FortOAuthProvider.EMAIL,
    FortOAuthProvider.WALLET,
  ];

  if (user) {

  }

  return (
    <PageContent>
      <ScrollArea mobileDirection={'horizontal'}>
        {/* <ProvidersContainer> */}
        {

          (user
            ? providers.filter(p => p !== FortOAuthProvider.GUEST && !user.linkedAccounts?.find(a => a.provider === p))
            : providers)
            .map((auth) => (
              <ProviderButtonSwitch key={auth} provider={auth} />
            ))
        }
        {/* </ProvidersContainer> */}
      </ScrollArea>
      <PoweredByFooter showDisclaimer={true} />
    </PageContent>
  )
}

export default Providers;
