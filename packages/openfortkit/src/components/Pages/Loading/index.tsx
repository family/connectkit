import React, { useEffect } from "react";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import Button from "../../Common/Button";
import { PageContent } from "../../Common/Modal/styles";
import { routes, useOpenfortKit } from "../../FortKit";
import { useAccount } from "wagmi";
import Loader from "../../Common/Loading";


const Loading: React.FC = () => {

  const { setRoute } = useOpenfortKit();
  const { isLoading, user, needsRecovery } = useOpenfort();
  const { address } = useAccount();
  const [isFirstFrame, setIsFirstFrame] = React.useState(true);

  useEffect(() => {
    if (isFirstFrame) return;

    if (isLoading)
      return

    else if (!user)
      setRoute(routes.PROVIDERS);

    else if (!address)
      setRoute(routes.RECOVER);
    //   setRoute(routes.CONNECTORS);

    else if (needsRecovery)
      setRoute(routes.RECOVER);

    else
      setRoute(routes.PROFILE);
  }, [isLoading, user, address, needsRecovery, isFirstFrame]);



  useEffect(() => {
    // UX: Wait a bit before showing the next page
    setTimeout(() => setIsFirstFrame(false), 400);
  }, []);

  return (
    <PageContent>
      <Loader reason="Redirecting" />
    </PageContent>
  )
}

export default Loading;
