import { useEffect, useRef, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { router, routes, useContext } from '../ConnectKit';
import { CustomTheme, Languages, Theme, Mode } from '../../types';
import Modal from '../Common/Modal';

import Onboarding from '../Pages/Onboarding';
import About from '../Pages/About';
import Connectors from '../Pages/Connectors';
import ConnectUsing from './ConnectUsing';
import DownloadApp from '../Pages/DownloadApp';
import Profile from '../Pages/Profile';
import SwitchNetworks from '../Pages/SwitchNetworks';
import MobileConnectors from '../Pages/MobileConnectors';
import SignInWithEthereum from '../Pages/SignInWithEthereum';

import { ConnectKitButton } from '../ConnectButton';
import { getAppName } from '../../defaultClient';
import { ConnectKitThemeProvider } from '../ConnectKitThemeProvider/ConnectKitThemeProvider';

import styled from './../../styles/styled';
import { keyframes } from 'styled-components';

const dist = 8;
const shake = keyframes`
  0%{ transform:none; }
  25%{ transform:translateX(${dist}px); }
  50%{ transform:translateX(-${dist}px); }
  75%{ transform:translateX(${dist}px); }
  100%{ transform:none; }
`;

const cursorIn = keyframes`
  0%{ transform:translate(500%,100%); opacity:0; }
  60%{ transform:translate(25%,-20%); opacity:1; }
  70%{ transform:translate(25%,-20%); }
  85%{ transform:translate(25%,-20%) scale(0.9); }
  100%{ transform:translate(25%,-20%) scale(1); opacity:1; }
`;

const Cursor = styled.div`
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4), 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  &.play {
    animation: ${cursorIn} 1300ms 200ms cubic-bezier(0.16, 1, 0.6, 1) both;
  }
`;

const Container = styled.div`
  z-index: 1;
  position: absolute;
  inset: 0;
  &.shake {
    animation: ${shake} 300ms 100ms cubic-bezier(0.16, 1, 0.6, 1) both;
  }
`;
const ButtonContainer = styled.div`
  z-index: 1;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &:before {
    z-index: 9;
    content: '';
    position: absolute;
    inset: 0;
  }
`;

const customThemeDefault: object = {};

const ConnectModal: React.FC<{
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
  lang?: Languages;
  inline?: boolean;
  open?: boolean;
  onClose?: () => void;
}> = ({
  theme = 'auto',
  customTheme = customThemeDefault,
  lang = 'en-US',
  mode = 'auto',
  inline = false,
  open,
  onClose,
}) => {
  const context = useContext();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const closeable = !chain?.unsupported;

  const showBackButton =
    !chain?.unsupported &&
    router.value !== routes.CONNECTORS &&
    router.value !== routes.PROFILE;

  const showInfoButton = !chain?.unsupported && router.value !== routes.PROFILE;

  const onBack = () => {
    if (router.value === routes.SIGNINWITHETHEREUM) {
      router.value = routes.PROFILE;
    } else if (router.value === routes.SWITCHNETWORKS) {
      router.value = routes.PROFILE;
    } else if (router.value === routes.DOWNLOAD) {
      router.value = routes.CONNECT;
    } else {
      router.value = routes.CONNECTORS;
    }
  };

  const pages: any = {
    onboarding: <Onboarding />,
    about: <About />,
    download: <DownloadApp connectorId={context.connector} />,
    connectors: <Connectors />,
    mobileConnectors: <MobileConnectors />,
    connect: <ConnectUsing connectorId={context.connector} />,
    profile: <Profile closeModal={() => setIsOpen(false)} />,
    switchNetworks: <SwitchNetworks />,
    signInWithEthereum: <SignInWithEthereum />,
  };

  const ref = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(open ?? false);

  useEffect(() => {
    if (open) router.value = isConnected ? routes.PROFILE : routes.CONNECTORS;
    setIsOpen(open ?? false);
  }, [open]);

  useEffect(() => {
    if (isOpen) router.value = isConnected ? routes.PROFILE : routes.CONNECTORS;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && inline) {
      if (onClose) {
        if (cursorRef.current) {
          cursorRef.current.classList.remove('play');
          void cursorRef.current.offsetWidth;
          cursorRef.current.classList.add('play');
        }
        setTimeout(() => {
          setIsOpen(true);
        }, 1500);
      } else {
        setTimeout(() => {
          setIsOpen(true);
        }, 500);
      }
    }
  }, [isOpen]);
  //useEffect(() => setIsOpen(false), [isConnected]);

  const onModalClose = () => {
    if (onClose) {
      setIsOpen(false);
      onClose();
    } else {
      if (ref.current) {
        // reset animation
        ref.current.classList.remove('shake');
        void ref.current.offsetWidth;
        ref.current.classList.add('shake');
      }
    }
  };

  useEffect(() => {
    if (isConnected) {
      if (
        router.value !== routes.PROFILE ||
        router.value !== routes.SIGNINWITHETHEREUM
      ) {
        if (
          context.signInWithEthereum &&
          !context.options?.disableSiweRedirect
        ) {
          router.value = routes.SIGNINWITHETHEREUM;
        } else {
          onModalClose(); // Hide on connect
        }
      }
    } else {
      onModalClose(); // Hide on connect
    }
  }, [isConnected]);

  /* When pulling data into WalletConnect, it prioritises the og:title tag over the title tag */
  useEffect(() => {
    const appName = getAppName();
    if (!appName || (!open && !inline)) return;

    const title = document.createElement('meta');
    title.setAttribute('property', 'og:title');
    title.setAttribute('content', appName);
    document.head.prepend(title);

    return () => {
      document.head.removeChild(title);
    };
  }, [open, inline]);

  return (
    <ConnectKitThemeProvider
      theme={theme}
      customTheme={customTheme}
      mode={mode}
    >
      <Container ref={ref}>
        {inline && onClose && (
          <>
            <Cursor ref={cursorRef} />
            <ButtonContainer>
              <ConnectKitButton
                customTheme={customTheme}
                theme={theme}
                mode={mode}
              />
            </ButtonContainer>
          </>
        )}
        <Modal
          demo={{ theme: theme, customTheme: customTheme, mode: mode }}
          onClose={closeable ? onModalClose : undefined}
          positionInside={inline}
          open={isOpen}
          pages={pages}
          onInfo={
            showInfoButton ? () => (router.value = routes.ABOUT) : undefined
          }
          onBack={showBackButton ? onBack : undefined}
        />
      </Container>
    </ConnectKitThemeProvider>
  );
};

export default ConnectModal;
