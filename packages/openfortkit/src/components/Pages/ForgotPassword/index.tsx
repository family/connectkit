import React, { useEffect } from "react";
import { useConnect } from "wagmi";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import Button from "../../Common/Button";
import Input from "../../Common/Input";
import { InnerContainer, ModalBody, PageContent } from "../../Common/Modal/styles";
import { routes, useOpenfortKit } from "../../OpenfortKit";
import { RecoveryMethod } from "@openfort/openfort-js";
import { OrDivider } from "../../Common/Modal";
import FitText from "../../Common/FitText";
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { AuthIcon } from "../../../assets/icons";
import { TextContainer } from "../../ConnectButton/styles";

// TODO: Localize
const RequestEmail: React.FC = () => {
  const [email, setEmail] = React.useState("");

  const { log, triggerResize } = useOpenfortKit();
  const { requestResetPassword } = useOpenfort();

  const [loading, setLoading] = React.useState(false);

  const [message, setMessage] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  useEffect(() => {
    triggerResize();
  }, [!error]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async () => {
    const cleanURL = window.location.origin + window.location.pathname;
    setLoading(true);
    requestResetPassword({
      email,
      redirectUrl: cleanURL + `?fort_forgot_password=true&email=${email}`,
    }).then(() => {
      setMessage("Reset email sent.");
      setLoading(false);
    }).catch((e) => {
      log(e);
      const code = e?.response?.status;
      switch (code) {
        case 400:
          setError("Email not verified.");
          break;
        default:
          setError("Error sending reset email.");
          break;
      }

      setLoading(false);
    })
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
          disabled={loading}
        />
        {
          error && (
            <ModalBody style={{ marginTop: 12 }} $error>
              <FitText>
                {error}
              </FitText>
            </ModalBody>
          )
        }
        <Button
          onClick={handleSubmit}
          disabled={loading || !!message}
          waiting={loading}
        >
          {message ? message : "Send reset email"}
        </Button>
      </form>
    </PageContent >
  )
}

const ResetPassword: React.FC = () => {
  const fixedUrl = window.location.href.replace("?state=", "&state="); // redirectUrl is not working with query params
  const url = new URL(fixedUrl);

  const [password, setPassword] = React.useState("");

  const { setRoute, triggerResize, log } = useOpenfortKit();
  const { resetPassword, logInWithEmailPassword, updateUser } = useOpenfort();

  const [loading, setLoading] = React.useState(false);

  const [message, setMessage] = React.useState<string>("");
  const email = url.searchParams.get("email")

  const handleSubmit = async () => {
    setLoading(true);

    const state = url.searchParams.get("state");
    if (!email || !state) {
      log("No email or state found");
      setLoading(false);
      return;
    }

    try {
      await resetPassword({
        password: password,
        email,
        state
      });

      await logInWithEmailPassword({
        email,
        password
      });

      const user = await updateUser();

      if (!user) throw new Error("No user found");

      ["fort_forgot_password", "state", "email"].forEach((param) => {
        url.searchParams.delete(param);
      });

      window.history.replaceState({}, document.title, url.toString());

      setRoute(routes.RECOVER);
    } catch (e) {
      log("Reset password error", e);

      setLoading(false);
      triggerResize();
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
        <FitText>
          {email ? `Reset password for ${email}` : "Reset password"}
        </FitText>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your new password"
          disabled={loading}
        />
        {
          message && (
            <FitText>
              {message}
            </FitText>
          )
        }
        <Button
          onClick={handleSubmit}
          disabled={loading}
          waiting={loading}
        >
          Reset password
        </Button>
      </form>
    </PageContent >
  )
}

const ForgotPassword: React.FC = () => {

  const url = new URL(window.location.href);
  const isRequestingEmail = !url.searchParams.get("fort_forgot_password");

  if (isRequestingEmail)
    return <RequestEmail />
  else
    return <ResetPassword />
}



export default ForgotPassword;
