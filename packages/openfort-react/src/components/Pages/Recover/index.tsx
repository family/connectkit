import { RecoveryMethod } from "@openfort/openfort-js";
import { motion } from 'framer-motion';
import React, { useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { KeyIcon, LockIcon, ShieldIcon } from "../../../assets/icons";
import wave from "../../../assets/wave";
import { useOpenfortCore } from '../../../openfort/useOpenfort';
import Button from "../../Common/Button";
import FitText from "../../Common/FitText";
import Input from "../../Common/Input";
import Loader from "../../Common/Loading";
import { ModalBody, ModalHeading, PageContent } from "../../Common/Modal/styles";
import { FloatWrapper, Graphic, GraphicBackground, Logo, LogoGraphic, LogoGroup, LogoInner, LogoPosition, RotateWrapper } from "../../FloatingGraphic/styles";
import { routes } from "../../Openfort/types";
import { useOpenfort } from '../../Openfort/useOpenfort';
import { useWallets } from "../../../hooks/openfort/useWallets";
import { embeddedWalletId } from "../../../constants/openfort";

// TODO: Localize

const Recover: React.FC = () => {
  const [recoveryPhrase, setRecoveryPhrase] = React.useState("");
  const [recoveryError, setRecoveryError] = React.useState<false | string>(false);
  const { triggerResize, uiConfig: options, log } = useOpenfort();
  const chain = useChainId();
  const [loading, setLoading] = React.useState(false);
  const { setActiveWallet } = useWallets();

  const handleSubmit = async () => {
    setLoading(true);

    const { error } = await setActiveWallet({
      connector: embeddedWalletId,
      password: recoveryPhrase,
    })
    setLoading(false);

    if (error) {
      setRecoveryError(error.message || "There was an error recovering your account");
    } else {
      log("Recovery success");
    }
  };

  useEffect(() => {
    if (recoveryError)
      triggerResize();
  }, [recoveryError]);

  return (
    <PageContent>
      <Graphic $height="110px">
        <LogoGroup>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic style={{ transform: "scale(1.2)" }}>
                      <KeyIcon />
                    </LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic style={{ transform: "scale(0.75)" }}>
                      <ShieldIcon />
                    </LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
          </Logo>
          <Logo>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic style={{ transform: "scale(0.5)" }}>
                      <LockIcon />
                    </LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
        </LogoGroup>
        <GraphicBackground>{wave}</GraphicBackground>
      </Graphic>
      <ModalHeading>Secure your account</ModalHeading>
      <ModalBody style={{ textAlign: "center" }}>
        <FitText>
          Set or enter your password to secure your account.
          {/* Enter the phrase to recover your account. */}

        </FitText>
      </ModalBody>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Input
          value={recoveryPhrase}
          onChange={(e) => setRecoveryPhrase(e.target.value)}
          type="password"
          placeholder="Enter your password"
          autoComplete="off"
        />

        {recoveryError && (
          <motion.div key={recoveryError} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModalBody style={{ height: 24, marginTop: 12 }} $error>
              <FitText>
                {recoveryError}
              </FitText>
            </ModalBody>
          </motion.div>
        )}
        <Button
          onClick={handleSubmit}
          waiting={loading}
          disabled={loading}
        >
          Enter
        </Button>
      </form>
    </PageContent >
  )
}

const AutomaticRecovery: React.FC = () => {
  const { needsRecovery } = useOpenfortCore();
  const { setActiveWallet } = useWallets();
  const { log } = useOpenfort();
  const [hasRecoveryMethod, setHasRecoveryMethod] = React.useState(false);

  useEffect(() => {
    (async () => {
      if (!needsRecovery) {
        log("Automatic recovery enabled, configuring embedded signer");

        const response = await setActiveWallet({
          connector: embeddedWalletId,
        })

        // TODO: Handle error properly
        if (response.error && response.error.message === "Missing recovery password") {
          setHasRecoveryMethod(true);
        }
      }
    })();
  }, [needsRecovery]);

  if (hasRecoveryMethod) {
    return <Recover />
  }

  return (
    <PageContent>
      <Loader reason="Setting up signer" />
    </PageContent>
  )
}

const Connected: React.FC = () => {
  const { setOpen } = useOpenfort();

  // hide on connect
  useEffect(() => {
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  }, []);

  return (
    <PageContent>
      <Loader
        isLoading={false}
        reason="Connected"
      />
    </PageContent>
  )
}

const CreateEmbeddedSigner: React.FC = () => {
  const { needsRecovery, user } = useOpenfortCore();
  const { triggerResize, uiConfig, walletConfig, setRoute } = useOpenfort();
  const [loading, setLoading] = React.useState(true);
  const [embeddedSignerLoading, setEmbeddedSignerLoading] = React.useState(true);
  const { isConnected } = useAccount();

  useEffect(() => {

    setTimeout(() => {
      setEmbeddedSignerLoading(false);
      triggerResize();
    }, 500);
  }, [])


  useEffect(() => {
    if (!user) return;

    if (uiConfig?.linkWalletOnSignUp || !walletConfig) {

      if (!user.linkedAccounts.find((account) => account.provider === "wallet")) {
        setRoute(routes.CONNECTORS);
        return;
      }

      if (!walletConfig) {
        // Logged in without a wallet
        setRoute(routes.PROFILE);
        return;
      }
    }

    setLoading(false);
  }, [user])

  if (embeddedSignerLoading || loading) {
    return (
      <PageContent>
        <Loader reason="Setting up signer" />
      </PageContent>
    )
  }

  if (isConnected && user) {
    return <Connected />
  }

  if (walletConfig && walletConfig.recoveryMethod === RecoveryMethod.AUTOMATIC) {
    return <AutomaticRecovery />
  }

  if (needsRecovery) {
    return <Recover />
  } else {
    return (
      <PageContent>
        <Loader reason="Setting up signer" />
      </PageContent>
    )
  }
}

export default CreateEmbeddedSigner;
