import React, { useEffect } from "react";
import { useConnect } from "wagmi";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import Button from "../../Common/Button";
import Input from "../../Common/Input";
import { InnerContainer, ModalBody, PageContent } from "../../Common/Modal/styles";
import { routes, useFortKit } from "../../FortKit";
import { RecoveryMethod } from "@openfort/openfort-js";
import { OrDivider } from "../../Common/Modal";
import { AnimatePresence } from "framer-motion";
import FitText from "../../Common/FitText";

// TODO: Localize

const EmailLogin: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { setRoute, triggerResize, log } = useFortKit();
  const { logInWithEmailPassword, user } = useOpenfort();

  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState(false);

  const handleSubmit = async () => {
    setLoginLoading(true);
    logInWithEmailPassword({
      email,
      password
    }).catch((e) => {
      log("Login error:", e);
      setLoginLoading(false);
      setLoginError(true);
      triggerResize();
    })
  }

  useEffect(() => {
    if (user)
      setRoute(routes.LOADING);
  }, [user]);

  return (
    <PageContent>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Input
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
            <FitText>Invalid email or password</FitText>
          </ModalBody>
        )}
        <Button
          onClick={handleSubmit}
          disabled={loginLoading}
        >
          Log in
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
