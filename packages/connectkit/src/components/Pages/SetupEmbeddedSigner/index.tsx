import React, { useEffect } from "react";
import { PageContent } from "../../Common/Modal/styles";
import { useFortKit } from "../../FortKit";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import { EmbeddedState } from "@openfort/openfort-js";
import { useAccount, useConnect, useEnsName } from "wagmi";


const SetupEmbeddedSigner: React.FC = () => {
  const { log } = useFortKit();
  const { handleRecovery, embeddedState, getEthereumProvider } = useOpenfort();

  const { connectors, connect } = useConnect();

  // // Configure embedded signer
  // useEffect(() => {

  //   // new-todo:allow configuration of embedded signer
  //   if (embeddedState === EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED) {
  //     handleRecovery({
  //       method: "automatic",
  //       chainId: 80002
  //     });
  //   }

  //   if (embeddedState === EmbeddedState.READY) {
  //     log("Getting ethereum provider");
  //     getEthereumProvider()
  //   }
  // }, [embeddedState]);

  // // Connect to wagmi with Openfort
  // useEffect(() => {
  //   if (embeddedState !== EmbeddedState.READY) return;
  //   const connector = connectors.find((connector) => connector.name === "Openfort")
  //   if (!connector) return

  //   log("Connecting to wagmi with Openfort");
  //   connect({ connector: connector!, chainId: 80002 });
  // }, [connectors, embeddedState])


  return (
    <PageContent>
      <div>
        Setting up embedded...{" "}{embeddedState}
      </div>
    </PageContent>
  )
}

export default SetupEmbeddedSigner;
