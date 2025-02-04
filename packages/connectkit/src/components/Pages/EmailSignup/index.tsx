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
  const [username, setUsername] = React.useState("");

  const { setRoute, triggerResize, log, options } = useFortKit();
  const { signUpWithEmailPassword, user, requestEmailVerification } = useOpenfort();

  const [signupLoading, setSignupLoading] = React.useState(false);
  const [signupError, setSignupError] = React.useState(false);

  const handleSubmit = async () => {
    setSignupLoading(true);
    signUpWithEmailPassword({
      email,
      password,
      options: {
        data: {
          name: username
        }
      }
    }).catch((e) => {
      log("Signup error:", e);
      setSignupLoading(false);
      setSignupError(true);
      triggerResize();
    }).then((user) => {
      if (user) {
        if (options?.skipEmailVerification) {
          setRoute(routes.RECOVER);
        }
        else {
          setRoute(routes.EMAIL_VERIFICATION);
        }
      }
      else {
        setSignupLoading(false);
        setSignupError(true);
        triggerResize();
      }
    });
  }

  // useEffect(() => {
  //   if (user)
  //     setRoute(routes.RECOVER);
  // }, [user]);

  return (
    <PageContent>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* <Input
          style={{ marginTop: 0 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Enter your username"
          disabled={signupLoading}
        /> */}
        <Input
          style={{ marginTop: 0 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email"
          disabled={signupLoading}
          autoComplete="off"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your password"
          disabled={signupLoading}
          autoComplete="new-password"
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
