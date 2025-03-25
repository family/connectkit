import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { useOpenfort } from '../../../openfort/useOpenfort';
import Loader from "../../Common/Loading";
import { PageContent } from "../../Common/Modal/styles";
import { useOpenfortKit } from '../../OpenfortKit/useOpenfortKit';
import { routes } from "../../OpenfortKit/types";


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
