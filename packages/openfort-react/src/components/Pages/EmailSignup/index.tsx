import React from "react";
import { useOpenfortCore } from '../../../openfort/useOpenfort';
import Button from "../../Common/Button";
import FitText from "../../Common/FitText";
import Input from "../../Common/Input";
import { OrDivider } from "../../Common/Modal";
import { ModalBody, PageContent } from "../../Common/Modal/styles";
import { useOpenfort } from '../../Openfort/useOpenfort';
import { routes } from "../../Openfort/types";
import { emailToVerifyLocalStorageKey } from "../../../constants/openfort";
import { AuthActionRequiredActions } from "@openfort/openfort-js";

// TODO: Localize

const EmailSignup: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");

  const { setRoute, triggerResize, log, uiConfig: options } = useOpenfort();
  const { client } = useOpenfortCore();

  const [signupLoading, setSignupLoading] = React.useState(false);
  const [signupError, setSignupError] = React.useState(false);

  const handleSubmit = async () => {
    setSignupLoading(true);
    client.auth.signUpWithEmailPassword({
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
        if ("action" in user && user.action === AuthActionRequiredActions.ACTION_VERIFY_EMAIL) {
          localStorage.setItem(emailToVerifyLocalStorageKey, email);
          setRoute(routes.EMAIL_VERIFICATION);
        } else {
          setRoute(routes.RECOVER);
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
