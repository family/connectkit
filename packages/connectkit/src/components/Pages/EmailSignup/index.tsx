import React, { useEffect } from "react";
import { useConnect } from "wagmi";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import Button from "../../Common/Button";
import Input from "../../Common/Input";
import { ModalBody, PageContent } from "../../Common/Modal/styles";
import { routes, useFortKit } from "../../FortKit";
import { RecoveryMethod } from "@openfort/openfort-js";
import { OrDivider } from "../../Common/Modal";
import FitText from "../../Common/FitText";

// TODO: Localize

const EmailSignup: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { setRoute, triggerResize, log } = useFortKit();
  const { signUpWithEmailPassword, user } = useOpenfort();

  const [signupLoading, setSignupLoading] = React.useState(false);
  const [signupError, setSignupError] = React.useState(false);

  const handleSubmit = async () => {
    setSignupLoading(true);
    signUpWithEmailPassword({
      email,
      password
    }).catch((e) => {
      log("Signup error:", e);
      setSignupLoading(false);
      setSignupError(true);
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
          disabled={signupLoading}
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your password"
          disabled={signupLoading}
        />

        {signupError && (
          <ModalBody style={{ height: 24, marginTop: 12 }} $error>
            <FitText>Invalid email or password</FitText>
          </ModalBody>
        )}
        <Button
          onClick={handleSubmit}
          disabled={signupLoading}
        >
          Sign up
        </Button>
      </form>
      <div style={{ marginTop: 16 }}>
        <OrDivider />
      </div>
      <Button
        onClick={() => { setRoute(routes.EMAIL_LOGIN) }}
      >
        Log in
      </Button>
    </PageContent >
  )
}

export default EmailSignup;
