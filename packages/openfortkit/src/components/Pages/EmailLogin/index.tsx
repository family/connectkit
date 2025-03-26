import { AnimatePresence, Variants, motion } from 'framer-motion';
import React from "react";
import { useOpenfort } from '../../../openfort/useOpenfort';
import { isPlayerVerified } from "../../../utils";
import Button from "../../Common/Button";
import { TextLinkButton } from "../../Common/Button/styles";
import FitText from "../../Common/FitText";
import Input from "../../Common/Input";
import { OrDivider } from "../../Common/Modal";
import { ModalBody, PageContent } from "../../Common/Modal/styles";
import { TextContainer } from "../../ConnectButton/styles";
import { useOpenfortKit } from '../../OpenfortKit/useOpenfortKit';
import { routes } from '../../OpenfortKit/types';

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

  const { setRoute, triggerResize, log, options } = useOpenfortKit();
  const { logInWithEmailPassword, logout, verifyEmail, requestEmailVerification } = useOpenfort();

  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState<false | string>(false);

  const handleSubmit = async () => {
    setLoginLoading(true);
    logInWithEmailPassword({
      email,
      password
    }).catch((e) => {
      log("Login error:", e);
      setLoginLoading(false);
      setLoginError("Invalid email or password.");
    }).then((user) => {
      // console.log("User", user);
      if (!user) {
        setLoginLoading(false);
        setLoginError("Invalid email or password.");
        return;
      }

      if (!options?.skipEmailVerification && !isPlayerVerified(user.player)) {
        setRoute(routes.EMAIL_VERIFICATION);
      } else {
        setRoute(routes.RECOVER);
      }
    });
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

        <ModalBody style={{ marginTop: 12 }} $error={!!loginError}>
          <AnimatePresence initial={false}>
            <motion.div
              style={{ height: 24 }}
              key={loginError ? "error" : "no-error"}
              initial={'initial'}
              animate={'animate'}
              exit={'exit'}
              variants={textVariants}
            >
              <FitText maxFontSize={80} >
                {loginError ? loginError : ""}
                <TextLinkButton
                  type="button"
                  onClick={() => {
                    setRoute(routes.FORGOT_PASSWORD);
                  }}
                >
                  Forgot password?
                </TextLinkButton>
              </FitText>
            </motion.div>
          </AnimatePresence>
        </ModalBody>
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
      </form>
      <div style={{ marginTop: 16 }}>
        <OrDivider />
      </div>
      <Button
        onClick={() => { setRoute(routes.EMAIL_SIGNUP) }}
        disabled={loginLoading}
      >
        Sign up
      </Button>
    </PageContent >
  )
}

export default EmailLogin;
