import { useEffect, useRef, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { routes, useContext } from '../ConnectKit';
import { CustomTheme, Languages, Theme, Mode } from '../../types';
import Modal from '../Common/Modal';

import { ConnectKitButton } from '../ConnectButton';
import { ConnectKitThemeProvider } from '../ConnectKitThemeProvider/ConnectKitThemeProvider';

import styled from './../../styles/styled';
import { keyframes } from 'styled-components';
import { useModalRoutes } from '.';
import { useWallets } from '../../wallets/useDefaultWallets';

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
  const { showBackButton, onInfo, onBack, pages } = useModalRoutes({
    onDisconnect: () => setIsOpen(false),
  });

  //if chain is unsupported we enforce a "switch chain" prompt
  const closeable = !(
    context.options?.enforceSupportedChains && chain?.unsupported
  );

  const ref = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(open ?? false);

  const wallets = useWallets();
  const oneWallet = wallets.length === 1 ? wallets[0] : undefined;
  const initOpen = () => {
    if (isConnected) {
      context.setRoute(routes.PROFILE);
    } else if (oneWallet) {
      context.setConnector(oneWallet.id);
      context.setRoute(routes.CONNECT);
    } else {
      context.setRoute(routes.CONNECTORS);
    }
  };

  useEffect(() => {
    if (open) initOpen();
    setIsOpen(open ?? false);
  }, [open]);

  useEffect(() => {
    if (open) initOpen();
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
          pageId={context.route}
          onInfo={onInfo}
          onBack={showBackButton ? onBack : undefined}
        />
      </Container>
    </ConnectKitThemeProvider>
  );
};

export default ConnectModal;
