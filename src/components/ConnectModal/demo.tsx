import { useEffect, useRef, useState } from 'react';
import { useConnect } from 'wagmi';
import { routes, useContext } from '../ConnectKit';
import { CustomTheme, Languages, Theme } from '../../types';
import Modal from '../Common/Modal';

import Onboarding from '../Pages/Onboarding';
import About from '../Pages/AboutAlt';
import Connectors from '../Pages/Connectors';
import ConnectUsing from './ConnectUsing';
import DownloadApp from '../Pages/DownloadApp';
import Profile from '../Pages/Profile';
import SwitchNetworks from '../Pages/SwitchNetworks';
import styled, { keyframes } from 'styled-components';
import MobileConnectors from '../Pages/MobileConnectors';
import { ConnectKitButton } from '../ConnectButton';

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

const Container = styled.div``;
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
  customTheme?: CustomTheme;
  lang?: Languages;
  inline?: boolean;
  open?: boolean;
  onClose?: () => void;
}> = ({
  theme = 'light',
  customTheme = customThemeDefault,
  lang = 'en',
  inline = false,
  open,
  onClose,
}) => {
  const context = useContext();
  const { isConnected } = useConnect();

  const ref = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(open ?? false);

  useEffect(() => setIsOpen(open ?? false), [open]);

  useEffect(() => {
    if (isOpen)
      context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && inline) {
      if (cursorRef.current) {
        cursorRef.current.classList.remove('play');
        void cursorRef.current.offsetWidth;
        cursorRef.current.classList.add('play');
      }
      setTimeout(() => {
        setIsOpen(true);
      }, 1500);
    }
  }, [isOpen]);

  const onModalClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
    /*
    if (ref.current) {
      // reset animation
      ref.current.classList.remove('shake');
      void ref.current.offsetWidth;
      ref.current.classList.add('shake');
    }
    */
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
  };

  useEffect(() => {
    setIsOpen(false);
  }, [isConnected]);

  return (
    <>
      <Container ref={ref}>
        {inline && (
          <>
            <Cursor ref={cursorRef} />
            <ButtonContainer>
              <ConnectKitButton />
            </ButtonContainer>
          </>
        )}
        <Modal
          demo={{ theme: theme, customTheme: customTheme }}
          onClose={onModalClose}
          positionInside={inline}
          open={isOpen}
          pages={pages}
          pageId={context.route}
          onInfo={
            context.route !== routes.PROFILE
              ? () => context.setRoute(routes.ABOUT)
              : undefined
          }
          onBack={
            context.route !== routes.CONNECTORS &&
            context.route !== routes.PROFILE
              ? () => {
                  if (context.route === routes.SWITCHNETWORKS) {
                    context.setRoute(routes.PROFILE);
                  } else if (context.route === routes.DOWNLOAD) {
                    context.setRoute(routes.CONNECT);
                  } else {
                    context.setRoute(routes.CONNECTORS);
                  }
                }
              : undefined
          }
        />
      </Container>
    </>
  );
};

export default ConnectModal;
