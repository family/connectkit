import { OAuthProvider } from "@openfort/openfort-js";
import React, { useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { EmailIcon, GuestIcon, } from "../../../assets/icons";
import Logos, { OtherSocials, providersLogos } from "../../../assets/logos";
import { useProviders } from "../../../hooks/openfort/useProviders";
import { useOpenfortCore } from '../../../openfort/useOpenfort';
import Button from "../../Common/Button";
import Loader from "../../Common/Loading";
import { BackButton, PageContent } from "../../Common/Modal/styles";
import PoweredByFooter from "../../Common/PoweredByFooter";
import { UIAuthProvider, routes, socialProviders } from "../../Openfort/types";
import { useOpenfort } from '../../Openfort/useOpenfort';
import { EmailInnerButton, ProviderIcon, ProviderInputInner, ProviderLabel, ProvidersButton as ProvidersButtonStyle } from "./styles";
import { Arrow, ArrowChevron, ArrowLine, ButtonContainerInner } from "../../Common/Button/styles";
import { Input } from "../../Common/Input/styles";
import { motion, AnimatePresence } from 'framer-motion';

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
  const { emailInput, setEmailInput } = useOpenfort();

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setRoute(user ? routes.LINK_EMAIL : routes.EMAIL_LOGIN);
  }

  return (
    <ProvidersButtonStyle>
      <form
        onSubmit={handleSubmit}
        noValidate
      >
        <ProviderInputInner>
          <input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            type="email"
            placeholder="Enter your email"
            autoFocus
            formNoValidate
          />
          <div
            style={{ position: "relative" }}
          >

            <AnimatePresence initial={false}>
              {
                emailInput ? (
                  <EmailInnerButton
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -5, opacity: 0, position: "absolute" }}
                    transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                    type="submit"
                    key={emailInput ? "enabled" : "disabled"}
                    aria-label="Submit email"
                  >
                    <ProviderIcon>
                      <svg
                        width="13"
                        height="12"
                        viewBox="0 0 13 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line
                          stroke="currentColor"
                          x1="1"
                          y1="6"
                          x2="12"
                          y2="6"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                        <path
                          stroke="currentColor"
                          d="M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                      </svg>
                    </ProviderIcon>
                  </EmailInnerButton>
                ) : (
                  <motion.div
                    initial={{ x: 5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 5, opacity: 0, position: "absolute" }}
                    transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <ProviderIcon>
                      <EmailIcon />
                    </ProviderIcon>
                  </motion.div>
                )
              }
            </AnimatePresence>
          </div>

        </ProviderInputInner>
      </form>
    </ProvidersButtonStyle>
  );
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

export const ProviderButtonSwitch: React.FC<{ provider: UIAuthProvider }> = ({ provider }) => {
  switch (provider) {
    case UIAuthProvider.GUEST:
      return <GuestButton />;
    case UIAuthProvider.WALLET:
      return <WalletButton />
    case UIAuthProvider.EMAIL:
      return <EmailButton />
    case UIAuthProvider.GOOGLE:
      return (
        <AuthProviderButton
          provider={OAuthProvider.GOOGLE}
          title="Google"
          icon={providersLogos[provider]}
        />
      )
    case UIAuthProvider.TWITTER:
      return (
        <AuthProviderButton
          provider={OAuthProvider.TWITTER}
          title="X"
          icon={providersLogos[provider]}
        />
      )
    case UIAuthProvider.FACEBOOK:
      return (
        <AuthProviderButton
          provider={OAuthProvider.FACEBOOK}
          title="Facebook"
          icon={providersLogos[provider]}
        />
      )
    case UIAuthProvider.DISCORD:
      return (
        <AuthProviderButton
          provider={OAuthProvider.DISCORD}
          title="Discord"
          icon={providersLogos[provider]}
        />
      )
    case UIAuthProvider.APPLE:
      return (
        <AuthProviderButton
          provider={OAuthProvider.APPLE}
          title="Apple"
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
      <Loader header="Updating user" />
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
