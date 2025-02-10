import { OAuthProvider } from "@openfort/openfort-js";
import React from "react";
import Logos, { providersLogos } from "../../../assets/logos";
import { useProviders } from "../../../hooks/openfort/useProviders";
import Button from "../../Common/Button";
import { PageContent } from "../../Common/Modal/styles";
import PoweredByFooter from "../../Common/PoweredByFooter";
import { ScrollArea } from "../../Common/ScrollArea";
import { KitOAuthProvider, routes, socialProviders, useOpenfortKit } from "../../FortKit";
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
  const { setRoute, setConnector } = useOpenfortKit();

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
          icon={providersLogos[provider]}
        />
      )
    case KitOAuthProvider.TWITTER:
      return (
        <AuthProviderButton
          provider={OAuthProvider.TWITTER}
          title="Twitter"
          icon={providersLogos[provider]}
        />
      )
    case KitOAuthProvider.FACEBOOK:
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
