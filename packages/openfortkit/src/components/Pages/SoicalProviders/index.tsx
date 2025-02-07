import { OAuthProvider } from "@openfort/openfort-js";
import React, { useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { EmailIcon, GuestIcon, } from "../../../assets/icons";
import Logos, { OtherSocials } from "../../../assets/logos";
import { useProviders } from "../../../hooks/openfort/useProviders";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import Button from "../../Common/Button";
import Loader from "../../Common/Loading";
import { PageContent } from "../../Common/Modal/styles";
import PoweredByFooter from "../../Common/PoweredByFooter";
import { ScrollArea } from "../../Common/ScrollArea";
import { KitOAuthProvider, routes, socialProviders, useFortKit } from "../../FortKit";
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

const ProviderButtonSwitch: React.FC<{ provider: KitOAuthProvider }> = ({ provider }) => {
  switch (provider) {
    case KitOAuthProvider.GOOGLE:
      return (
        <AuthProviderButton
          provider={OAuthProvider.GOOGLE}
          title="Google"
          icon={<Logos.Google />}
        />
      )
    case KitOAuthProvider.TWITTER:
      return (
        <AuthProviderButton
          provider={OAuthProvider.TWITTER}
          title="Twitter"
          icon={<Logos.Twitter />}
        />
      )
    case KitOAuthProvider.FACEBOOK:
      return (
        <AuthProviderButton
          provider={OAuthProvider.FACEBOOK}
          title="Facebook"
          icon={<Logos.Facebook />}
        />
      )
    default:
      throw new Error(`NOT IMPLEMENTED: ${provider}`);
  }
}

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
