import { useEffect, useState } from "react";
import { providersLogos } from "../../assets/logos";
import { useOpenfort } from '../../openfort/useOpenfort';
import Loader from "../Common/Loading";
import { PageContent } from "../Common/Modal/styles";
import { useOpenfortKit } from '../OpenfortKit/useOpenfortKit';
import { routes } from "../OpenfortKit/types";

const states = {
  INIT: "init",
  REDIRECT: "redirect",
  CONNECTING: "connecting",
};

const ConnectWithOAuth: React.FC<{}> = ({ }) => {
  const { connector, setRoute, log } = useOpenfortKit();
  const { initOAuth, getAccessToken, initLinkOAuth, storeCredentials, user } = useOpenfort();

  const [status, setStatus] = useState(states.INIT);

  useEffect(() => {
    (async () => {
      if (connector.type !== "oauth") throw new Error("Invalid connector type");

      const url = new URL(window.location.href);
      const hasProvider = !!url.searchParams.get("fort_auth_provider");
      const provider = connector.id;

      switch (status) {
        case states.INIT:
          if (hasProvider) setStatus(states.CONNECTING);
          else setTimeout(() => setStatus(states.REDIRECT), 150); // UX: wait a bit before redirecting
          break;
        case states.CONNECTING:
          const player = url.searchParams.get("player_id");
          const accessToken = url.searchParams.get("access_token");
          const refreshToken = url.searchParams.get("refresh_token");

          // Remove specified keys from the URL
          [
            "fort_auth_provider",
            "refresh_token",
            "access_token",
            "player_id",
          ].forEach((key) => url.searchParams.delete(key));
          window.history.replaceState({}, document.title, url.toString());

          if (!player || !accessToken || !refreshToken) {
            console.error(`Missing player id or access token or refresh token: player=${player}, accessToken=${accessToken ? accessToken.substring(0, 10) + "..." : accessToken}, refreshToken=${refreshToken}`);
            return;
          }

          storeCredentials({
            player,
            accessToken,
            refreshToken,
          })

          setRoute(routes.LOADING);
        case states.REDIRECT:
          if (hasProvider) return;

          const cleanURL = window.location.origin + window.location.pathname;

          const queryParams = Object.fromEntries(
            [...url.searchParams.entries()].filter(([key]) =>
              [
                "fort_auth_provider",
                "refresh_token",
                "access_token",
                "player_id",
              ].includes(key)
            )
          );
          queryParams["fort_auth_provider"] = provider;

          try {

            if (user) {
              const authToken = await getAccessToken();
              if (!authToken) {
                console.error("No auth token found");
                setRoute(routes.LOADING);
                return;
              }
              const linkResponse = await initLinkOAuth({
                authToken,
                provider,
                options: {
                  redirectTo: cleanURL,
                  queryParams,
                }
              });
              log(linkResponse);
              window.location.href = linkResponse.url;
            } else {
              const r = await initOAuth({
                provider,
                options: {
                  redirectTo: cleanURL,
                  queryParams,
                }
              });
              log(r);
              window.location.href = r.url;
            }
          }
          catch (e) {
            console.error("Error during OAuth initialization:", e);
            setRoute(routes.CONNECT);
          }
          break;
      }
    })();
  }, [status]);

  return (
    <PageContent>
      <Loader
        reason={`Connecting with ${connector.id}`}
        icon={providersLogos[connector.id]}
      />
    </PageContent>
  )
}

export default ConnectWithOAuth;
