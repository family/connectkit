import React, { useEffect, useState } from "react";
import { EmailIcon } from "../../../assets/icons";
import wave from "../../../assets/wave";
import { useOpenfort } from '../../../openfort/useOpenfort';
import { isPlayerVerified } from "../../../utils";
import { TextLinkButton } from "../../Common/Button/styles";
import Loader from "../../Common/Loading";
import { ModalBody, ModalContent, ModalH1, PageContent } from "../../Common/Modal/styles";
import { useOpenfortKit } from '../../OpenfortKit/useOpenfortKit';
import { routes } from "../../OpenfortKit/types";
import { FloatWrapper, Graphic, GraphicBackground, Logo, LogoGraphic, LogoGroup, LogoInner, LogoPosition, RotateWrapper } from "../Onboarding/styles";

// TODO: Localize

const EmailVerification: React.FC = () => {
  const { user, verifyEmail, logout, requestEmailVerification, updateUser } = useOpenfort();
  const { setRoute, log } = useOpenfortKit();
  const linkedAccount = user?.linkedAccounts?.find((account) => account.provider === "email");

  const [loading, setLoading] = useState(true);
  const [shouldSendEmailVerification, setShouldSendEmailVerification] = useState(false);

  const sendEmailVerification = async () => {
    if (!linkedAccount || !linkedAccount.email) {
      log("No linked account found");
      return;
    }

    requestEmailVerification({
      email: linkedAccount.email,
      redirectUrl: window.location.origin + window.location.pathname + "?fort_email_verification=true",
    }).catch((e) => {
      log("Error requesting email verification", e);
    })
  }

  useEffect(() => {
    if (shouldSendEmailVerification) {
      sendEmailVerification();
    }
  }, [shouldSendEmailVerification])

  useEffect(() => {
    if (!linkedAccount || !linkedAccount.email) {
      // waiting for linked account to load
      updateUser()
        .then((user) => {
          if (!user) {
            log("No linked account found");
            setRoute(routes.EMAIL_LOGIN);
            return;
          }
        })
        .catch((e) => {
          log("Error loading user", e);
        })
      return;
    }

    const fixedUrl = window.location.href.replace("?state=", "&state="); // redirectUrl is not working with query params
    const url = new URL(fixedUrl);
    const fortEmailVerification = url.searchParams.get("fort_email_verification");

    if (!fortEmailVerification) {
      setShouldSendEmailVerification(true);
      setLoading(false);
      return;
    }

    const state = url.searchParams.get("state");

    if (!state) {
      console.error("No state found in URL");
      return;
    }

    const removeParams = () => {
      ["state", "fort_email_verification"].forEach((key) => url.searchParams.delete(key));
      window.history.replaceState({}, document.title, url.toString());
    }

    const onAccountVerified = async () => {
      log("Account verified, redirecting to recover");
      const user = await updateUser();
      if (isPlayerVerified(user)) {
        removeParams();
        setRoute(routes.RECOVER);
      }
    }

    log("EmailVerification state", state, linkedAccount, user);
    if (linkedAccount.verified) {
      onAccountVerified();
      return;
    } else {
      verifyEmail({
        email: linkedAccount.email,
        state,
      }).then(() => {
        onAccountVerified();
      }).catch((e) => {
        log("Error verifying email", e);
      })
    }
  }, [linkedAccount])


  if (loading) {
    return (
      <PageContent>
        <Loader reason="Checking if account is verified" />
      </PageContent >
    )
  }

  return ( // TODO: Improve this page
    <PageContent>
      <Graphic>
        <LogoGroup>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>
                      <EmailIcon />
                    </LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>
                      <EmailIcon />
                    </LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>
                      <EmailIcon />
                    </LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>
                      <EmailIcon />
                    </LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
          <Logo>
            <LogoPosition>
              <LogoInner>
                <FloatWrapper>
                  <RotateWrapper>
                    <LogoGraphic>
                      <EmailIcon />
                    </LogoGraphic>
                  </RotateWrapper>
                </FloatWrapper>
              </LogoInner>
            </LogoPosition>
          </Logo>
        </LogoGroup>
        <GraphicBackground>{wave}</GraphicBackground>
      </Graphic>
      <ModalContent>
        <ModalH1 $small>
          Email sent
        </ModalH1>
        <ModalBody style={{ height: 40 }}>
          Please check your email.<br />
          {linkedAccount?.email}
        </ModalBody>
        <TextLinkButton
          style={{ textDecoration: 'underline' }}
          onClick={() => { logout(); setRoute(routes.EMAIL_LOGIN); }}
        >
          Use another email
        </TextLinkButton>
      </ModalContent>
    </PageContent>
  )

}

export default EmailVerification;
