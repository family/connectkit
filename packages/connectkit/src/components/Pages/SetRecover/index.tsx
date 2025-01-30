import React, { useEffect } from "react";
import { useConnect } from "wagmi";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import Button from "../../Common/Button";
import Input from "../../Common/Input";
import { ModalBody, PageContent } from "../../Common/Modal/styles";
import { useFortKit } from "../../FortKit";
import { RecoveryMethod } from "@openfort/openfort-js";
import FitText from "../../Common/FitText";

// TODO: Localize

const SetRecover: React.FC = () => {
  const [recoveryPhrase, setRecoveryPhrase] = React.useState("");
  const { handleRecovery } = useOpenfort();
  const [recoveryError, setRecoveryError] = React.useState(false);
  const { triggerResize } = useFortKit();

  const handleSubmit = () => {
    handleRecovery({// TODO: Add chainId
      method: RecoveryMethod.PASSWORD,
      password: recoveryPhrase,
      chainId: 80002
    }).then((success) => {
      if (success) {
        console.log("Recovery success");
      } else {
        setRecoveryError(true);
      }
    });
  };

  useEffect(() => {
    if (recoveryError)
      triggerResize();
  }, [recoveryError]);

  return (
    <PageContent>
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
          placeholder="Enter your recovery phrase"
        />

        {recoveryError && (
          <ModalBody style={{ height: 24, marginTop: 12 }} $error>
            <FitText>
              The recovery phrase you entered is incorrect.
            </FitText>
          </ModalBody>
        )}
        <Button>
          Enter
        </Button>
      </form>
    </PageContent >
  )
}

export default SetRecover;
