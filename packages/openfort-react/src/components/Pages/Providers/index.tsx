import { OAuthProvider } from "@openfort/openfort-js";
import React, { useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { EmailIcon, GuestIcon, } from "../../../assets/icons";
import Logos, { OtherSocials, providersLogos } from "../../../assets/logos";
import { useProviders } from "../../../hooks/openfort/useProviders";
import { useOpenfortCore } from '../../../openfort/useOpenfort';
import Button from "../../Common/Button";
import Loader from "../../Common/Loading";
import { PageContent } from "../../Common/Modal/styles";
import PoweredByFooter from "../../Common/PoweredByFooter";
import { AuthProvider, routes, socialProviders } from "../../Openfort/types";
import { useOpenfort } from '../../Openfort/useOpenfort';
import { ProviderIcon, ProviderLabel, ProvidersButton as ProvidersButtonStyle } from "./styles";

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
  const { signUpGuest } = useOpenfortCore();
  const { setRoute } = useOpenfort();

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
  const { setRoute } = useOpenfort();
  return <ProviderButton
    onClick={() => setRoute(routes.CONNECTORS)}
    icon={<Logos.OtherWallets />}
  >
    Wallet
  </ProviderButton>
}

const EmailButton: React.FC = () => {
  const { setRoute } = useOpenfort();
  const { user } = useOpenfortCore();

  return <ProviderButton
    onClick={() => setRoute(user ? routes.LINK_EMAIL : routes.EMAIL_LOGIN)}
    icon={<EmailIcon />}
  >
    Email
  </ProviderButton>
}

const AuthProviderButton: React.FC<{ provider: OAuthProvider, title?: string, icon?: React.ReactNode }> = ({ provider, title = provider + " login", icon }) => {
  const { setRoute, setConnector } = useOpenfort();

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

export const ProviderButtonSwitch: React.FC<{ provider: AuthProvider }> = ({ provider }) => {
  switch (provider) {
    case AuthProvider.GUEST:
      return <GuestButton />;
    case AuthProvider.WALLET:
      return <WalletButton />
    case AuthProvider.EMAIL:
      return <EmailButton />
    case AuthProvider.GOOGLE:
      return (
        <AuthProviderButton
          provider={OAuthProvider.GOOGLE}
          title="Google"
          icon={providersLogos[provider]}
        />
      )
    case AuthProvider.TWITTER:
      return (
        <AuthProviderButton
          provider={OAuthProvider.TWITTER}
          title="X"
          icon={providersLogos[provider]}
        />
      )
    case AuthProvider.FACEBOOK:
      return (
        <AuthProviderButton
          provider={OAuthProvider.FACEBOOK}
          title="Facebook"
          icon={providersLogos[provider]}
        />
      )
    default:
      throw new Error(`NOT IMPLEMENTED: ${provider}`);
  }
}

// This accounts for the case where the user has an address but no user, which can happen if the user has not signed up yet, but logged in with a wallet
const AddressButNoUserCase: React.FC = () => {
  const { updateUser } = useOpenfortCore();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    updateUser()
      .then((user) => {
        if (!user)
          disconnect();
      })
      .catch(() => {
        console.error("Failed to update user");
      })
  }, [])

  return (
    <PageContent>
      <Loader reason="Updating user" />
    </PageContent>
  )
}

const SocialProvidersButton = () => {
  const { setRoute } = useOpenfort();
  return (
    <ProviderButton
      onClick={() => setRoute(routes.SOCIAL_PROVIDERS)}
      icon={<OtherSocials />}
    >
      Other socials
    </ProviderButton>
  )
}


const Providers: React.FC = () => {
  const maxProviders = 4

  const { user } = useOpenfortCore();
  const { address } = useAccount();
  const { allProviders, availableProviders } = useProviders();

  if (address && !user) {
    return <AddressButNoUserCase />
  }

  const activeProviders = user ? availableProviders : allProviders;
  const hasExcessProviders = activeProviders.length > maxProviders
  const filteredProviders = hasExcessProviders ? activeProviders.filter((p) => !socialProviders.includes(p)) : activeProviders;

  return (
    <PageContent>
      {
        (filteredProviders).map((auth) => (
          <ProviderButtonSwitch key={auth} provider={auth} />
        ))
      }
      {
        hasExcessProviders && <SocialProvidersButton />
      }
      <PoweredByFooter showDisclaimer={true} />
    </PageContent>
  )
}

export default Providers;
