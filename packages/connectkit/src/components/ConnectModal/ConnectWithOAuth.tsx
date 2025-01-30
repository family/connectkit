import { useEffect, useState } from "react";
import { PageContent } from "../Common/Modal/styles";
import { routes, useFortKit } from "../FortKit";
import { useOpenfort } from "../../openfort/OpenfortProvider";

const states = {
  INIT: "init",
  // LOADING: "loading",
  REDIRECT: "redirect",
  CONNECTING: "connecting",
};

const ConnectWithOAuth: React.FC<{}> = ({ }) => {
  const { connector, setRoute, log } = useFortKit();
  const { initOAuth, storeCredentials } = useOpenfort();

  const [status, setStatus] = useState(states.INIT);

  useEffect(() => {
    if (connector.type !== "oauth") throw new Error("Invalid connector type");

    const url = new URL(window.location.href);
    const hasProvider = !!url.searchParams.get("fort_auth_provider");
    const provider = connector.id;

    console.log("status", status, "hasProvider", hasProvider, "provider", provider);

    switch (status) {
      case states.INIT:
        if (hasProvider) setStatus(states.CONNECTING);
        else setStatus(states.REDIRECT);
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
        window.history.replaceState(null, "", url.toString());

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

        initOAuth({
          provider,
          options: {
            redirectTo: cleanURL,
            queryParams,
          }
        }).then((r) => {
          log(r);
          // console.log("SHOULD REDIRECT TO", r.url);
          window.location.href = r.url;
        }).catch((e) => {
          log(`Error logging in with ${provider}:`, e);
        });

        break;
    }


  }, [status]);


  useEffect(() => {
  }, []);

  return (
    <PageContent>
      Connecting with oauth... {connector.id}
    </PageContent>
  )
}

export default ConnectWithOAuth;
