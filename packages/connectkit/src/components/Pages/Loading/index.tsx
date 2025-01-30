import React, { useEffect } from "react";
import { useOpenfort } from "../../../openfort/OpenfortProvider";
import Button from "../../Common/Button";
import { PageContent } from "../../Common/Modal/styles";
import { routes, useFortKit } from "../../FortKit";


const Loading: React.FC = () => {

  const { setRoute, triggerResize } = useFortKit();
  const { isLoading, user, needsRecovery, logout } = useOpenfort();


  useEffect(() => {
    if (isLoading)
      setRoute(routes.LOADING);
    else if (!user)
      setRoute(routes.LOGIN);
    else if (needsRecovery)
      setRoute(routes.RECOVER);
    else
      setRoute(routes.PROFILE);

  }, [isLoading, user, needsRecovery]);

  const [isFirstFrame, setIsFirstFrame] = React.useState(true);

  useEffect(() => {
    setIsFirstFrame(false);
    triggerResize();
  }, []);

  if (isFirstFrame) return <PageContent />;

  // TODO: Add a loading spinner
  return (
    <PageContent>
      <div>
        Loading... Loading...
      </div>

      <Button onClick={() => { logout() }}>
        logout (for testing only)
      </Button>
    </PageContent>
  )
}

export default Loading;
