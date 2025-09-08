import { EmbeddedState, RecoveryMethod } from "@openfort/openfort-js";
import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from "react";
import { Hex, setErrorConfig } from "viem";
import { useAccount, useEnsName } from "wagmi";
import { FingerPrintIcon, KeyIcon, LockIcon, ShieldIcon } from "../../../assets/icons";
import { embeddedWalletId } from "../../../constants/openfort";
import { UserWallet, useWallets } from "../../../hooks/openfort/useWallets";
import { useEnsFallbackConfig } from "../../../hooks/useEnsFallbackConfig";
import { useOpenfortCore } from '../../../openfort/useOpenfort';
import { truncateEthAddress } from "../../../utils";
import Button from "../../Common/Button";
import CopyToClipboard from "../../Common/CopyToClipboard";
import FitText from "../../Common/FitText";
import Input from "../../Common/Input";
import Loader from "../../Common/Loading";
import { ModalBody, ModalHeading, PageContent } from "../../Common/Modal/styles";
import TickList from "../../Common/TickList";
import { FloatingGraphic } from "../../FloatingGraphic";
import { useOpenfort } from '../../Openfort/useOpenfort';
import { getPasswordStrength, MEDIUM_SCORE_THRESHOLD } from "../../PasswordStrength/password-utility";
import { PasswordStrengthIndicator } from "../../PasswordStrength/PasswordStrengthIndicator";
import { OtherMethodButton } from "./styles";

// TODO: Localize

const RecoverPasswordWallet = ({ wallet }: { wallet: UserWallet }) => {
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [recoveryError, setRecoveryError] = useState<false | string>(false);
  const { triggerResize, uiConfig: options, log } = useOpenfort();
  const [loading, setLoading] = useState(false);
  const { setActiveWallet } = useWallets();

  const handleSubmit = async () => {
    setLoading(true);

    const { error } = await setActiveWallet({
      connector: embeddedWalletId,
      password: recoveryPhrase,
      address: wallet.address,
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

  const ensFallbackConfig = useEnsFallbackConfig();
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: wallet.address,
    config: ensFallbackConfig,
  });
  const separator = '....'

  return (
    <PageContent>
      <FloatingGraphic
        height="130px"
        logoCenter={{
          logo: <KeyIcon />,
          size: "1.2",
        }}
        logoTopLeft={{
          logo: <ShieldIcon />,
          size: "0.75",
        }}
        logoBottomRight={{
          logo: <LockIcon />,
          size: "0.5",
        }}
      />
      <ModalHeading>Recover wallet</ModalHeading>
      <ModalBody style={{ textAlign: "center" }}>
        Please enter the recovery password to recover wallet{" "}
        <CopyToClipboard string={wallet.address}>
          {ensName ?? truncateEthAddress(wallet.address, separator)}
        </CopyToClipboard>
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
          Recover wallet
        </Button>
      </form>
    </PageContent >
  )
}

const RecoverAutomaticWallet = ({ walletAddress }: { walletAddress: Hex }) => {
  const { embeddedState } = useOpenfortCore();
  const { setActiveWallet } = useWallets();
  const { log } = useOpenfort();
  const [error, setError] = useState<false | string>(false);

  useEffect(() => {
    (async () => {
      if (embeddedState === EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED) {
        log("Automatically recovering wallet", walletAddress);

        const response = await setActiveWallet({
          connector: embeddedWalletId,
        })
        if (response.error) {
          setError(response.error.message || "There was an error recovering your account");
          log("Error recovering wallet", response.error);
        }
      }
    })();
  }, [embeddedState]);

  if (error) {
    <PageContent>
      <ModalBody style={{ textAlign: "center" }} $error>
        <FitText>
          {error}
        </FitText>
      </ModalBody>
    </PageContent>
  }

  return (
    <PageContent>
      <Loader reason={`Recovering wallet...`} />
    </PageContent>
  )
}

const CreateWalletAutomaticRecovery = () => {
  const { embeddedState } = useOpenfortCore();
  const { createWallet } = useWallets();
  const [shouldCreateWallet, setShouldCreateWallet] = useState(false);
  const { log } = useOpenfort();

  useEffect(() => {
    // To ensure the wallet is created only once
    if (shouldCreateWallet) {
      (async () => {
        log("Creating wallet Automatic recover");
        const response = await createWallet()
        if (response.error) {
          log("Error creating wallet", response.error);
        }
      })();
    }
  }, [shouldCreateWallet]);

  useEffect(() => {
    if (embeddedState === EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED) {
      setShouldCreateWallet(true);
    }
  }, [embeddedState]);

  return (
    <PageContent>
      <Loader reason="Creating wallet..." />
    </PageContent>
  )
}

const OtherMethod = ({ currentMethod, onChangeMethod }: { currentMethod: RecoveryMethod, onChangeMethod: (method: RecoveryMethod | "other") => void }) => {
  const { uiConfig } = useOpenfort();
  const otherMethods = useMemo(() => {
    const allowedMethods = uiConfig.walletRecovery.allowedMethods;
    const otherMethods = allowedMethods.filter((method) => method !== currentMethod);
    return otherMethods;
  }, [uiConfig, currentMethod]);

  if (otherMethods.length === 0) return null;

  if (otherMethods.length === 1) {
    const method = otherMethods[0];
    let text: string;
    switch (method) {
      case RecoveryMethod.PASSWORD:
        text = "Use password recovery";
        break;
      case RecoveryMethod.AUTOMATIC:
        text = "Skip for now";
        break;
      default:
        text = method;
    }
    return (
      <OtherMethodButton onClick={() => {
        onChangeMethod(method);
      }}>
        {text}
      </OtherMethodButton>
    );
  }

  return (
    <OtherMethodButton
      onClick={() => onChangeMethod("other")}
    >
      Choose another recovery method
    </OtherMethodButton>
  )
}

const CreateWalletPasskeyRecovery = ({ onChangeMethod }: { onChangeMethod: (method: RecoveryMethod | "other") => void }) => {
  const [recoveryError, setRecoveryError] = useState<false | string>(false);
  const { triggerResize } = useOpenfort();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setRecoveryError("Passkey recovery is not yet supported. Please choose another recovery method.");
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  useEffect(() => {
    if (recoveryError)
      triggerResize();
  }, [recoveryError]);

  return (
    <PageContent>
      <FloatingGraphic
        height="80px"
        logoCenter={{
          logo: <FingerPrintIcon />,
          size: "1.2",
        }}
        logoTopLeft={{
          logo: <ShieldIcon />,
          size: "0.75",
        }}
        logoBottomRight={{
          logo: <LockIcon />,
          size: "0.5",
        }}
      />
      <ModalHeading>Secure your wallet</ModalHeading>
      <ModalBody style={{ textAlign: "center" }}>
        <FitText>
          Use passkey to secure your wallet.
        </FitText>

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
          {loading ? "Setting up passkey..." : "Set up passkey"}
        </Button>
        <OtherMethod
          currentMethod={RecoveryMethod.PASSWORD}
          onChangeMethod={onChangeMethod}
        />
      </ModalBody>
    </PageContent >
  )
}

const CreateWalletPasswordRecovery = ({ onChangeMethod }: { onChangeMethod: (method: RecoveryMethod | "other") => void }) => {
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [recoveryError, setRecoveryError] = useState<false | string>(false);
  const { triggerResize, uiConfig: options, log } = useOpenfort();
  const [showPasswordIsTooWeakError, setShowPasswordIsTooWeakError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createWallet } = useWallets();

  const handleSubmit = async () => {
    if (getPasswordStrength(recoveryPhrase) < MEDIUM_SCORE_THRESHOLD) {
      setShowPasswordIsTooWeakError(true);
      return;
    }

    setLoading(true);

    const { error } = await createWallet({
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
      <FloatingGraphic
        height="80px"
        logoCenter={{
          logo: <KeyIcon />,
          size: "1.2",
        }}
        logoTopLeft={{
          logo: <ShieldIcon />,
          size: "0.75",
        }}
        logoBottomRight={{
          logo: <LockIcon />,
          size: "0.5",
        }}
      />
      <ModalHeading>Secure your wallet</ModalHeading>
      <ModalBody style={{ textAlign: "center" }}>
        <FitText>
          Set a password for your wallet.
        </FitText>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Input
            value={recoveryPhrase}
            onChange={(e) => {
              if (showPasswordIsTooWeakError)
                setShowPasswordIsTooWeakError(false);
              setRecoveryPhrase(e.target.value);
            }}
            type="password"
            placeholder="Enter your password"
            autoComplete="off"
          />

          <PasswordStrengthIndicator
            password={recoveryPhrase}
            showPasswordIsTooWeakError={showPasswordIsTooWeakError}
          />
          <TickList
            items={[
              "You will use this password to access your wallet",
              "Make sure it's strong and memorable",
            ]}
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
            Create wallet
          </Button>
        </form>
        <OtherMethod
          currentMethod={RecoveryMethod.PASSWORD}
          onChangeMethod={onChangeMethod}
        />
      </ModalBody>
    </PageContent >
  )
}

const ChooseRecoveryMethod = ({ onChangeMethod }: { onChangeMethod: (method: RecoveryMethod | "other") => void }) => {
  return (
    <PageContent>
      <ModalHeading>Choose a recovery method</ModalHeading>
      <Button onClick={() => onChangeMethod(RecoveryMethod.PASSWORD)}>
        Password
      </Button>
      <Button onClick={() => onChangeMethod(RecoveryMethod.AUTOMATIC)}>
        Automatic
      </Button>
      {/* <Button onClick={() => onChangeMethod(RecoveryMethod.PASSKEY)}>
        Passkey
      </Button> */}
    </PageContent>
  )
}

const RecoverWallet = ({ wallet }: { wallet: UserWallet }) => {
  switch (wallet.recoveryMethod) {
    case RecoveryMethod.PASSWORD:
      return <RecoverPasswordWallet wallet={wallet} />
    case RecoveryMethod.AUTOMATIC:
      return <RecoverAutomaticWallet walletAddress={wallet.address} />
    default:
      console.error("Unsupported recovery method: " + wallet.recoveryMethod + ", defaulting to automatic.");
      return <RecoverAutomaticWallet walletAddress={wallet.address} />
  }
}

const CreateWallet = () => {
  const { uiConfig } = useOpenfort();
  const [userSelectedMethod, setUserSelectedMethod] = useState<RecoveryMethod | "other" | null>(null);

  return <CreateWalletPasskeyRecovery onChangeMethod={setUserSelectedMethod} />;
  if (userSelectedMethod) {
    switch (userSelectedMethod) {
      case RecoveryMethod.PASSWORD:
        return <CreateWalletPasswordRecovery onChangeMethod={setUserSelectedMethod} />
      case RecoveryMethod.AUTOMATIC:
        return <CreateWalletAutomaticRecovery />
      case "other":
        return <ChooseRecoveryMethod onChangeMethod={setUserSelectedMethod} />
      default:
        throw new Error("Unsupported recovery method: " + userSelectedMethod);
    }
  }

  // Default recovery method configured
  switch (uiConfig.walletRecovery.defaultMethod) {
    case RecoveryMethod.PASSWORD:
      return <CreateWalletPasswordRecovery onChangeMethod={setUserSelectedMethod} />
    case RecoveryMethod.AUTOMATIC:
      return <CreateWalletAutomaticRecovery />
    default:
      throw new Error("Unsupported recovery method: " + uiConfig.walletRecovery.defaultMethod);
  }
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

const RecoverPage: React.FC = () => {
  const { needsRecovery, user } = useOpenfortCore();
  const { triggerResize, uiConfig, walletConfig, setRoute } = useOpenfort();
  const { wallets, isLoadingWallets } = useWallets();
  // const [loading, setLoading] = useState(true);
  const [embeddedSignerLoading, setEmbeddedSignerLoading] = useState(true);
  const { isConnected } = useAccount();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isLoadingWallets) {
      timeout = setTimeout(() => {
        setEmbeddedSignerLoading(false);
        triggerResize();
      }, 500);
    }
    return () => { clearTimeout(timeout); }
  }, [isLoadingWallets]);

  const openfortWallets = useMemo(() => {
    return wallets.filter((wallet) => wallet.id === embeddedWalletId);
  }, [wallets]);

  // useEffect(() => {
  //   if (!user) return;

  //   if (uiConfig?.linkWalletOnSignUp || !walletConfig) {
  //     if (!user.linkedAccounts.find((account) => account.provider === "wallet")) {
  //       setRoute(routes.CONNECTORS);
  //       return;
  //     }

  //     if (!walletConfig) {
  //       // Logged in without a wallet
  //       setRoute(routes.PROFILE);
  //       return;
  //     }
  //   }

  //   setLoading(false);
  // }, [user])



  if (embeddedSignerLoading) {
    return (
      <PageContent>
        <Loader reason="Setting up wallet" />
      </PageContent>
    )
  }

  if (isConnected && user) {
    return <Connected />
  }

  if (!openfortWallets) {
    // Here wallets should be loaded, so if we don't have them something went wrong
    // TODO: add error logs
    return (
      <PageContent>
        An unexpected error occurred. Please try again later.
      </PageContent>
    )
  }

  if (openfortWallets.length === 0) {
    return (
      <CreateWallet />
    )
  }

  // if (wallets.length === 1) {
  return (
    <RecoverWallet wallet={openfortWallets[0]} />
  )
  // }

  // return (
  //   <PageContent>
  //     <div style={{ flexDirection: "column", display: "flex", gap: 8 }}>
  //       {wallets.map((wallet) => (
  //         <div key={wallet.address}>
  //           {wallet.address} - {wallet.recoveryMethod} recover
  //         </div>
  //       ))}
  //     </div>
  //   </PageContent>
  // )

  // if (walletConfig && walletConfig.recoveryMethod === RecoveryMethod.AUTOMATIC) {
  //   return <AutomaticRecovery />
  // }

  // if (needsRecovery) {
  //   return <Recover />
  // } else {
  //   return (
  //     <PageContent>
  //       <Loader reason="Setting up signer" />
  //     </PageContent>
  //   )
  // }
}

export default RecoverPage;
