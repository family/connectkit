import React, { useEffect } from "react";
import { useConnect } from "wagmi";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import Button from "../../Common/Button";
import Input from "../../Common/Input";
import { InnerContainer, ModalBody, PageContent } from "../../Common/Modal/styles";
import { routes, useFortKit } from "../../FortKit";
import { RecoveryMethod } from "@openfort/openfort-js";
import { OrDivider } from "../../Common/Modal";
import FitText from "../../Common/FitText";
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { AuthIcon } from "../../../assets/icons";
import { TextContainer } from "../../ConnectButton/styles";
import { TextLinkButton } from "../Providers/styles";

// TODO: Localize

const textVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: {
    position: 'absolute',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

const EmailLogin: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { setRoute, triggerResize, log } = useFortKit();
  const { logInWithEmailPassword, linkEmailPassword, getAccessToken, user, updateUser } = useOpenfort();

  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState<false | string>(false);

  const handleSubmit = async () => {
    setLoginLoading(true);
    if (!user) {
      logInWithEmailPassword({
        email,
        password
      }).catch((e) => {
        log("Login error:", e);
        setLoginLoading(false);
        setLoginError("Invalid email or password.");
        triggerResize();
      }).then((user) => {
        console.log("User", user);
        if (!user) {
          setLoginLoading(false);
          setLoginError("There was an error logging in.");
          triggerResize();
          return;
        }
        const emailAccount = user.player.linkedAccounts.find((account) => account.provider === "email");
        if (!emailAccount?.verified) {
          setLoginLoading(false);
          setLoginError("There was an error logging in.");
          triggerResize();
        } else {
          setRoute(routes.PROFILE);
        }

        // setRoute(routes.RECOVER);

      });
    } else {
      const authToken = getAccessToken();
      if (!authToken) {
        log("No token found");
        setLoginLoading(false);
        setLoginError("No token found.");
        triggerResize();
        return;
      }
      linkEmailPassword({
        email,
        password,
        authToken,
      }).catch((e) => {
        log("Link error:", e);
        setLoginLoading(false);
        setLoginError("Could not link email.");
        triggerResize();
      }).then(() => {
        updateUser()
          .then(() => {
            setRoute(routes.PROFILE);
          })
      });
    }
  }

  return (
    <PageContent>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Input
          style={{ marginTop: 0 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email"
          disabled={loginLoading}
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your password"
          disabled={loginLoading}
        />

        {loginError && (
          <ModalBody style={{ height: 24, marginTop: 12 }} $error>
            <FitText>
              {loginError}
              <TextLinkButton
                type="button"
                onClick={() => {
                  setRoute(routes.FORGOT_PASSWORD);
                }}
              >
                Forgot password?
              </TextLinkButton>
            </FitText>
          </ModalBody>
        )}
        {
          !user ? (
            <Button
              onClick={handleSubmit}
              disabled={loginLoading}
              waiting={loginLoading}
            >
              <AnimatePresence initial={false}>
                {loginLoading ? (
                  <TextContainer
                    key="connectedText"
                    initial={'initial'}
                    animate={'animate'}
                    exit={'exit'}
                    variants={textVariants}
                  >
                    Logging in...
                  </TextContainer>
                ) : (
                  <TextContainer
                    key="connectedText"
                    initial={'initial'}
                    animate={'animate'}
                    exit={'exit'}
                    variants={textVariants}
                  >
                    Log in
                  </TextContainer>
                )}
              </AnimatePresence>
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loginLoading}
              waiting={loginLoading}
            >
              <AnimatePresence initial={false}>
                {loginLoading ? (
                  <TextContainer
                    key="connectedText"
                    initial={'initial'}
                    animate={'animate'}
                    exit={'exit'}
                    variants={textVariants}
                  >
                    Linking email...
                  </TextContainer>
                ) : (
                  <TextContainer
                    key="connectedText"
                    initial={'initial'}
                    animate={'animate'}
                    exit={'exit'}
                    variants={textVariants}
                  >
                    Link email
                  </TextContainer>
                )}
              </AnimatePresence>
            </Button>
          )
        }
      </form>
      {
        !user && (
          <>
            <div style={{ marginTop: 16 }}>
              <OrDivider />
            </div>
            <Button
              onClick={() => { setRoute(routes.EMAIL_SIGNUP) }}
              disabled={loginLoading}
            >
              Sign up
            </Button>
          </>
        )
      }
    </PageContent >
  )
}

export default EmailLogin;
