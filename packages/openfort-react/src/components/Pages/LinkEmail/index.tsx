import { AnimatePresence, Variants } from 'framer-motion';
import React from "react";
import { useOpenfortCore } from '../../../openfort/useOpenfort';
import Button from "../../Common/Button";
import FitText from "../../Common/FitText";
import Input from "../../Common/Input";
import { ModalBody, PageContent } from "../../Common/Modal/styles";
import { TextContainer } from "../../ConnectButton/styles";
import { useOpenfortKit } from '../../Openfort/useOpenfortKit';
import { routes } from '../../Openfort/types';

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

const LinkEmail: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { setRoute, triggerResize, log } = useOpenfortKit();
  const { client, updateUser } = useOpenfortCore();

  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState<false | string>(false);

  const handleSubmit = async () => {
    setLoginLoading(true);

    await client.validateAndRefreshToken();
    const authToken = await client.getAccessToken();
    if (!authToken) {
      log("No token found");
      setLoginLoading(false);
      setLoginError("No token found.");
      triggerResize();
      return;
    }
    client.auth.linkEmailPassword({
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
            </FitText>
          </ModalBody>
        )}

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
      </form>
    </PageContent >
  )
}

export default LinkEmail;
