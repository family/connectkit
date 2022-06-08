import { useEffect, useRef } from 'react';
import { useConnect } from 'wagmi';
import { routes, useContext } from '../ConnectKit';
import { CustomTheme, Languages, Theme } from '../../types';
import Modal from '../Common/Modal';

import Onboarding from '../Pages/Onboarding';
import About from '../Pages/About';
import Connectors from '../Pages/Connectors';
import ConnectUsing from './ConnectUsing';
import DownloadApp from '../Pages/DownloadApp';
import Profile from '../Pages/Profile';
import SwitchNetworks from '../Pages/SwitchNetworks';
import styled, { keyframes } from 'styled-components';

const dist = 8;
const shake = keyframes`
  0%{ transform:none; }
  25%{ transform:translateX(${dist}px); }
  50%{ transform:translateX(-${dist}px); }
  75%{ transform:translateX(${dist}px); }
  100%{ transform:none; }
`;

const Container = styled.div`
  position: absolute;
  inset: 0;
  &.shake {
    animation: ${shake} 220ms ease-out both;
  }
`;

const customThemeDefault: object = {};

const ConnectModal: React.FC<{
  theme?: Theme;
  customTheme?: CustomTheme;
  lang?: Languages;
  hideOverlay?: boolean;
}> = ({
  theme = 'light',
  customTheme = customThemeDefault,
  lang = 'en',
  hideOverlay,
}) => {
  const context = useContext();
  const ref = useRef<HTMLDivElement | null>(null);
  const { isConnected } = useConnect();

  const onClose = () => {
    if (ref.current) {
      // reset animation
      ref.current.classList.remove('shake');
      void ref.current.offsetWidth;
      ref.current.classList.add('shake');
    }
  };

  useEffect(() => context.setTheme(theme), [theme]);
  useEffect(() => context.setCustomTheme(customTheme), [customTheme]);
  useEffect(() => context.setLang(lang), [lang]);

  const pages: any = {
    onboarding: <Onboarding />,
    about: <About />,
    download: <DownloadApp connectorId={context.connector} />,
    connectors: <Connectors />,
    connect: <ConnectUsing connectorId={context.connector} />,
    profile: <Profile />,
    switchnetworks: <SwitchNetworks />,
  };

  return (
    <Container ref={ref}>
      <Modal
        onClose={onClose}
        hideOverlay={hideOverlay}
        positionInside
        open={true}
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
  );
};

export default ConnectModal;
